import { request } from "graphql-request";
import filter from "lodash/filter";
import flatMap from "lodash/flatMap";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isObject from "lodash/isObject";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import omit from "lodash/omit";
import pickBy from "lodash/pickBy";
import property from "lodash/property";
import * as React from "react";
import componentTypes from "../../types/component-types";
import schemaTypes from "../../types/schema";
import * as gql from "./gql-query-builder";

const schemaQueries = schemaTypes.Query;

function connected(component) {
  let queryCache = {};

  interface ConnectState {
    data: {};
  }

  const componentPropTypeAST = get(
    componentTypes[component.name],
    "component.value.members",
    []
  );

  class Connect<P = {}> extends React.Component<P, ConnectState> {
    public static propTypeAST: unknown; // TODO: Figure out the exact type
    public static filename: string;
    public static variables: Array<{
      id: string;
      query?: string;
      // TODO: Type better
      mapToCollection?: (result: any) => any;
      mapToOption?: (result: any) => { value: any; label: any };
      validation?: { type: any; default: any };
    }>;
    public state: ConnectState = {
      data: {},
    };
    constructor(props) {
      super(props);

      this.state = { data: queryCache };
    }
    public componentDidMount() {
      this.fetchData().then(data => this.setState(() => data));
    }
    public componentDidUpdate(prevProps) {
      if (!isEqual(prevProps, this.props)) {
        this.fetchData().then(data => this.setState(() => data));
      }
    }
    public render() {
      if (this.state.data === null) {
        return null;
      }

      return React.createElement(component, {
        ...this.props,
        ...this.state.data,
      });
    }
    public fetchData() {
      const endpoint = "/graphql";
      const propNames = map(componentPropTypeAST, ({ key: { name } }) => name);
      const queries = schemaQueries.fields;
      const matchingQueries = filter(
        queries,
        query => propNames.find(name => query.name === name && name !== "theme") // TODO: Remove theme hack
      ) as typeof queries;

      // TODO: Figure out how to deal with variable types (introspect from schema)
      // object values have value.value.name (if value.kind is generic) that gives string (TS class + field)
      // that field can then be used for figuring out the fields
      // TODO: Figure out how to deal with the theme + figure out the exact shape for the query
      const operations = map(matchingQueries, query => ({
        operation: query.name,
        variables: getOperationVariables(query, omit(this.props, ["id"])), // TODO: remove the omit hack - id should be a ref
        fields: getOperationFields(
          getMatchingComponent(componentPropTypeAST, query.name),
          schemaTypes
        ),
      }));

      const gqlQuery = gql.query(operations);

      console.log(gqlQuery.query);

      return request(endpoint, gqlQuery.query, gqlQuery.variables)
        .then(data => {
          queryCache = data;

          return { data };
        })
        .catch(err => console.error(err));
    }
  }

  Connect.propTypeAST = componentPropTypeAST;

  return Connect;
}

function getOperationVariables(query, props) {
  const args = query.args;

  return mapValues(pickBy(props, prop => !isObject(prop)), (value, name) => {
    const arg = args.find(arg => arg.name === name);

    if (!arg) {
      return {};
    }

    return {
      value,
      required: arg.type.kind === "NON_NULL",
      type: arg.type.ofType.name,
    };
  });
}

function getMatchingComponent(componentAST, queryName) {
  const matchingComponent = componentAST.find(
    ({ key: { name } }) => name === queryName
  );

  if (!matchingComponent) {
    console.warn("No matching component found for fields");

    return [];
  }

  return matchingComponent;
}

function getOperationFields(matchingComponent, schemaTypes) {
  console.log("ZZZ", matchingComponent);

  if (get(matchingComponent, "value.kind") === "object") {
    return matchingComponent.value.members.map(parseField);
  } else if (get(matchingComponent, "value.kind") === "generic") {
    const params = matchingComponent.value.typeParams.params;

    return flatMap(params, param => {
      return map(param.members, member => {
        return getOperationFields(member.value, schemaTypes);
      });
    });
  } else if (get(matchingComponent, "value.value") === "scalar") {
    return matchingComponent.value.value.name.kind;
  } else if (get(matchingComponent, "value.kind") === "arrayType") {
    const members = getOperationFields(
      matchingComponent.value.type,
      schemaTypes
    );

    return members;
  }

  console.log("bar", matchingComponent);

  return parseField(matchingComponent);
}

function parseField(member) {
  const value = get(member, "value.value", member);

  const valuesType = value.name;
  let matchingField;

  if (value.kind === "import") {
    const typeName = value.moduleSpecifier.split("./")[1];

    matchingField = schemaTypes[typeName];
  } else if (value.kind === "union") {
    matchingField = valuesType;
  } else if (value.kind === "id") {
    console.log("got id", member);

    return ""; // TODO
  } else if (value.kind === "class") {
    const typeName = parseTypeName(valuesType);
    const fieldName = parseFieldName(valuesType);

    // TODO: What if type doesn't match?
    const matchingType = schemaTypes[typeName] || {};
    matchingField = (matchingType.fields || []).find(
      ({ name }) => name === fieldName
    );

    return parseTypeFields(matchingField, fieldName);
  } else if (value.kind === "generic") {
    console.log("foo", value, member);

    if (value.typeParams) {
      return {
        // TODO: This needs a fix at the parser. It's missing
        // the array field name.
        sessions: flatMap(value.typeParams.params, ({ members }) => {
          return map(members, member => {
            return parseFieldName(member.value.value.name);
          });
        }),
      };
    }

    return parseFieldName(value.value.name);
  }

  console.log("no match member", member);

  return parseTypeFields(matchingField, member.key.name);
}

function parseTypeName(name) {
  return name.split("['")[0];
}

function parseFieldName(name) {
  return name.split("['")[1].split("']")[0]; // TODO: Parse in a nicer way;
}

function parseTypeFields(matchingField, memberName, i = 0) {
  // Max. recursion levels. Avoid getting stuck.
  // TODO: What's the right way to deal with this?
  if (i === 10) {
    return "";
  }

  if (
    get(matchingField, "type.kind") === "ENUM" ||
    get(matchingField, "type.kind") === "SCALAR" ||
    get(matchingField, "type.ofType.kind") === "ENUM" ||
    get(matchingField, "type.ofType.kind") === "SCALAR"
  ) {
    return memberName;
  } else if (
    get(matchingField, "type.kind") === "LIST" ||
    get(matchingField, "type.ofType.kind") === "LIST"
  ) {
    const listType =
      matchingField.type.ofType.ofType.name ||
      matchingField.type.ofType.ofType.ofType.name;
    const matchingListType = schemaTypes[listType] || {};
    const matchingFields = filter(
      map(matchingListType.fields, field =>
        parseTypeFields(field, field.name, i + 1)
      ),
      Boolean
    );

    if (matchingFields.length > 0) {
      return {
        [memberName]: matchingFields,
      };
    }

    return memberName;
  } else if (
    get(matchingField, "type.kind") === "OBJECT" ||
    get(matchingField, "type.ofType.kind") === "OBJECT"
  ) {
    const objectType =
      matchingField.type.name || matchingField.type.ofType.name;
    const matchingObjectType = schemaTypes[objectType] || {};

    return {
      [memberName]: map(matchingObjectType.fields, property("name")),
    };
  }

  return memberName;
}

export default connected;
