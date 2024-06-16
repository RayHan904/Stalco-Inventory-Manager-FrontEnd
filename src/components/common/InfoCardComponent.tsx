import React from 'react';
import { Card } from 'react-bootstrap';

interface InfoCardProps {
    cardTitle: string;
    text?: string;
    perc?: string;
    width?: string;
  }
  

const InfoCardComponent: React.FC<{cardTitle: string, text?: string, perc?: string, width?: string}> = ({cardTitle, text, perc, width = "50%"}: InfoCardProps) => {

  return (
    <Card className="text-center" style={{ width: width, margin: '0 auto', marginBottom: '10px', padding: '3px' }}>
    <Card.Body style={{ padding: '0' }}>
        <Card.Title>{cardTitle}</Card.Title>
        <Card.Text> {text && text} {text && perc && "-"} {perc && <strong>{perc}</strong>} </Card.Text>
    </Card.Body>
</Card>
  );
};

export default InfoCardComponent;
