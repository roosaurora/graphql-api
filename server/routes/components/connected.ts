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

      // TODO: map based on key.theme to queries from schemaTypes

      // 1. Figure out query based on componentProps and schemaTypes
      // 2. Construct query using https://github.com/atulmy/gql-query-builder

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
