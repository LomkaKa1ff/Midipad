import React from 'react';

export default function Pagination() {
    return (
        <div className="pagination">
            <button className="page-btn">Prev</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">...</span>
            <button className="page-btn">8</button>
            <button className="page-btn">Next</button>
        </div>
    );
}