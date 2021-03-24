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

export const getPosts = (user) => {
  return graphqlRequest({query: `{
    posts {
      description, 
      image, 
      author {
        name
      },
      likes,
      like,
      date,
      postId,
      myPost
    }
  }`});      
}

export const createPost = (post) => { 
  return fetch('/upload', {
	  method: 'POST',
	  headers: {
	    Accept: 'application/json',
	  },
	  body: post
  }).then(response => response.json())
  .then((response) => {return graphqlRequest({query: `
    mutation {
        createPost(description: "${post.get("description")}", image: "${response.filename}") {
          description,
          image
        }    
    }`})
  });
}

export const likePost = (postId) => {
  return graphqlRequest({query: `
    mutation {
      like(postId: "${postId}") {
        likes,
        like
      }
    }`
  });
}

export const unlikePost = (postId) => {
  return graphqlRequest({query: `
    mutation {
      unlike(postId: "${postId}") {
        likes,
        like
      }
    }`
  });
}

export const deletePost = (postId) => {
  return graphqlRequest({query: `
    mutation {
      deletePost(postId: "${postId}")
    }
  `})
}