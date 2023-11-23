import React from 'react';
import notFound from '../../assets/notFound.jpg'
import Card from "react-bootstrap/Card";

export const NotFound = () => {
    return (
      <div>
        <Card.Img style={{ height: '550px' }} src={notFound} alt="Card image" className="notFoundImg" />
      </div>
    );
  };

