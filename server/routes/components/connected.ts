// import extractReactTypes from "extract-react-types";
import { request } from "graphql-request";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import * as React from "react";
import componentTypes from "../../types/component-types";
import schemaTypes from "../../types/schema";

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
      const query = ``;
      const variables = {};

      console.log(
        "fetch data for",
        component.name,
        componentPropTypeAST,
        schemaQueries,
        this.props
      );

      // 1. Figure out which queries to perform based on available data
      // 2. Generate structure + populate using props as variables
      // 3. Request
      // 4. Aggregate results with Promise.all

      // TODO: map based on key.theme to queries from schemaTypes

      // https://github.com/atulmy/gql-query-builder
      /*
      const query = queryBuilder({
        type: 'query',
        operation: 'thoughts', // match against schema queries based on props
        fields: ['id', 'name', 'thought'],  // from type def?
        variables: {} // from props
      })
      */

      return request(endpoint, query, variables)
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

export default connected;
