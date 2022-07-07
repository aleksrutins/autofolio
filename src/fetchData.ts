import { graphql } from "@octokit/graphql";
import config from "../config";

export type Data = {
    user: {
        name: string;
        avatarUrl: string;
        itemShowcase: {
            items: {
                edges: {
                    node: {
                        __typename: 'Repository' | 'Gist';
                        name: string;
                        description: string;
                        languages: {
                            edges: {
                                node: {
                                    name: string;
                                    color: string;
                                }
                            }[];
                        }
                    }
                }[];
            }
        }
    }
}


export function fetchData() {
    return graphql.defaults({
        headers: {
            authorization: `token ${process.env.GITHUB_TOKEN}`
        }
    })<Data>(`
    query data($username: String!) { 
        user(login: $username) {
          name
          avatarUrl
          itemShowcase {
            items(first: 10) {
              edges {
                node {
                  __typename
                  ... on Repository {
                    name
                    description
                    languages(first:5) {
                      edges {
                        node {
                          name
                          color
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `, { username: config.githubUsername });
}