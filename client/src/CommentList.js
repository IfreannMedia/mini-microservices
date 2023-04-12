import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ comments }) => {
    const renderedComments = Object.values(comments).map(comment => {
        return <li key={comment.id}>{comment.content}</li>;
    });


    return (
        <ul>{renderedComments}</ul>
    )
};

export default CommentList;