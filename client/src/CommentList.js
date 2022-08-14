import React from "react";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    if(comment.status==-1){
      return <li key={comment.id}>Awaiting moderation</li>;
    }
    else if(comment.status==0){
      return <li key={comment.id}>Rejected</li>;
    }
    if(comment.status==1){
      return <li key={comment.id}>{comment.content}</li>;
    }
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
