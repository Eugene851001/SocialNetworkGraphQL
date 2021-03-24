import { useMutation } from '@apollo/client';

function graphqlRequest(query) {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(query)
  }).then(
       response => response.json()
    );
}

export const getUser = (userId) => {
  return graphqlRequest({query: `{ 
      user(id: "${userId}") {
        name,
        photo,
        signed,
        myProfile
      }
    }`
  });
}

export const editPhoto = (photo) => {
  return fetch('/upload', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: photo
  }).then(response => response.json())
  .then(response => graphqlRequest({query: `mutation {
      editPhoto(filename: "${response.filename}")
    }`}
  ))
}

export const getUsers = () => {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({query: '{users {name, photo, userId} }'})
  })
    .then(response => response.json());
}

export const follow = (userId) => {
  return graphqlRequest({query: `mutation {follow(userId: "${userId}")}`})
}

export const unfollow = (userId) => {
  return graphqlRequest({query: `mutation {unfollow(userId: "${userId}")}`})
}

export const getFollowing = (userId) => {
  return graphqlRequest({query: `{
    following(userId: "${userId}") {
      name,
      photo,
      userId
    }
  }`})
}

export const getFollowers = (userId) => {
  return graphqlRequest({query: `{
    followers(userId: "${userId}") {
      name,
      photo,
      userId
    }
  }`})
}