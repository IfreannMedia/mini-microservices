import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ comments }) => {
    const renderedComments = Object.values(comments).map(comment => {
        let content;
        switch (comment.status) {
            case 'approved':
                content = comment.content;
                break;
            case 'pending':
                content = 'awaiting moderation';
                break;
            case 'rejected':
                content = 'comment removed';
                break;
            default:
                break;
        }

        return <li key={comment.id}>{content}</li>;
    });


    return (
        <ul>{renderedComments}</ul>
    )
};

export default CommentList;