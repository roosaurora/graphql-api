// import extractReactTypes from "extract-react-types";
import { request } from "graphql-request";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import * as React from "react";
import componentTypes from "../../types/component-types";
import schemaTypes from "../../types/schema";

// Load components/templates into a lookup
// TODO: Move this to some init phase that also sets up endpoint
// How can this work in the browser?

console.log(componentTypes, schemaTypes);

function connected(component) {
  let queryCache = {};

  interface ConnectState {
    data: {};
  }

  const componentProps = get(
    componentTypes[component.name],
    "component.value.members",
    []
  );
  // TODO: map based on key.theme to queries from schemaTypes

  console.log("component", component.name, componentProps);

  // 1. Figure out query based on componentProps and schemaTypes
  // 2. Construct query using a fork of https://github.com/Kmaschta/graphql-ast-types

  class Connect<P = {}> extends React.Component<P, ConnectState> {
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

      return request(endpoint, query, variables)
        .then(data => {
          queryCache = data;

          return { data };
        })
        .catch(err => console.error(err));
    }
  }

  return Connect;
}

export default connected;
