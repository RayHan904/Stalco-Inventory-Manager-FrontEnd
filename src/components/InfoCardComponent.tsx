import React from 'react';
import { Card } from 'react-bootstrap';

interface InfoCardProps {
    cardTitle: string;
    text: string;
    perc?: string;
  }
  

const InfoCardComponent: React.FC<{cardTitle: string, text: string, perc?: string}> = ({cardTitle, text, perc}: InfoCardProps) => {
  return (
    <Card className="text-center" style={{ width: '50%', margin: '0 auto', marginBottom: '10px', padding: '3px' }}>
    <Card.Body style={{ padding: '0' }}>
        <Card.Title>{cardTitle}</Card.Title>
        <Card.Text> {text} {perc && "-"} {perc && <strong>{perc}</strong>} </Card.Text>
    </Card.Body>
</Card>
  );
};

export default InfoCardComponent;
