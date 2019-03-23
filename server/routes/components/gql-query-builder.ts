import isObject from "lodash/isObject";
import isString from "lodash/isString";
import map from "lodash/map";

type Fields = object | string;

interface IQueryBuilderOptions {
  operation: string /* Operation name */;
  fields?: Fields /* Selection of fields to be returned by the operation */;
  variables?: any /* Any variables for the operation */;
}

enum OperationType {
  Mutation = "mutation",
  Query = "query",
}

function queryOperation(
  options: IQueryBuilderOptions | IQueryBuilderOptions[]
) {
  if (Array.isArray(options)) {
    return queriesBuilder(options);
  }

  return queryBuilder(options);
}

function queryBuilder({
  operation,
  fields = [],
  variables = {},
}: IQueryBuilderOptions) {
  return operationWrapperTemplate(
    OperationType.Query,
    variables,
    operationTemplate({ variables, operation, fields })
  );
}

function queriesBuilder(queries: IQueryBuilderOptions[]) {
  return operationWrapperTemplate(
    OperationType.Query,
    resolveVariables(queries),
    queries.map(operationTemplate).join("\n  ")
  );
}

function mutationOperation(
  options: IQueryBuilderOptions | IQueryBuilderOptions[]
) {
  if (Array.isArray(options)) {
    return mutationsBuilder(options);
  }

  return mutationBuilder(options);
}

function mutationBuilder({
  operation,
  fields = [],
  variables = {},
}: IQueryBuilderOptions) {
  return operationWrapperTemplate(
    OperationType.Mutation,
    variables,
    operationTemplate({ variables, operation, fields })
  );
}

function mutationsBuilder(mutations: IQueryBuilderOptions[]) {
  return operationWrapperTemplate(
    OperationType.Mutation,
    resolveVariables(mutations),
    mutations.map(operationTemplate).join("\n  ")
  );
}

function resolveVariables(operations: IQueryBuilderOptions[]): any {
  let ret: any = {};

  operations.forEach(({ variables }) => {
    ret = { ...ret, ...variables };
  });

  return ret;
}

function operationWrapperTemplate(
  type: OperationType,
  variables: any,
  content: string
) {
  return {
    query: `${type} ${queryDataArgumentAndTypeMap(variables)} {
  ${content}
}`,
    variables: queryVariablesMap(variables),
  };
}

function operationTemplate({
  variables,
  operation,
  fields,
}: IQueryBuilderOptions) {
  return `${operation} ${queryDataNameAndArgumentMap(variables)} {
    ${queryFieldsMap(fields)}
  }`;
}

// Convert object to name and argument map. eg: (id: $id)
function queryDataNameAndArgumentMap(variables?: any) {
  return variables && Object.keys(variables).length
    ? `(${Object.keys(variables).reduce(
        (dataString, key, i) =>
          `${dataString}${i !== 0 ? ", " : ""}${key}: $${key}`,
        ""
      )})`
    : "";
}

// Convert object to argument and type map. eg: ($id: Int)
function queryDataArgumentAndTypeMap(variables: any): string {
  return Object.keys(variables).length
    ? `(${Object.keys(variables).reduce(
        (dataString, key, i) =>
          `${dataString}${i !== 0 ? ", " : ""}$${key}: ${queryDataType(
            variables[key]
          )}`,
        ""
      )})`
    : "";
}

// Fields selection map. eg: { id, name }
function queryFieldsMap(fields?: Fields): string {
  if (isString(fields)) {
    // TODO: Eliminate?
    return fields;
  }

  return map(fields, value => {
    if (isObject(value)) {
      return `${Object.keys(value)[0]} { ${queryFieldsMap(
        Object.values(value)[0]
      )} }`;
    }

    return value;
  }).join(", ");
}

// Variables map. eg: { "id": 1, "name": "Jon Doe" }
function queryVariablesMap(variables: any) {
  const variablesMapped: { [key: string]: unknown } = {};

  Object.keys(variables).map(key => {
    variablesMapped[key] =
      typeof variables[key] === "object"
        ? variables[key].value
        : variables[key];
  });

  return variablesMapped;
}

// Get GraphQL equivalent type of data passed (String, Int, Float, Boolean)
function queryDataType(variable: any) {
  return `${variable.type}${variable.required ? "!" : ""}`;
}

export { mutationOperation as mutation, queryOperation as query };
