import React, { useState } from 'react';
import './App.css';  // Import the CSS file for styling

const App = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [responseData, setResponseData] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleJsonInputChange = (e) => {
        setJsonInput(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const parsedData = JSON.parse(jsonInput);
            console.log("parsedData", parsedData);
            console.log('selectedOptions', selectedOptions);

            // Prepare query params based on selected options
            const queryParams = selectedOptions.map(option => {
                if (option === 'numbers') return 'isNumber=true';
                if (option === 'alphabets') return 'isAlphabet=true';
                if (option === 'highest_lowercase_alphabet') return 'isHighestLowercaseAlphabet=true';
                return '';
            }).join('&');

            const response = await fetch(`http://127.0.0.1:5000/bfhl?${queryParams}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsedData),
            });
            const data = await response.json();
            setResponseData(data);
        } catch (error) {
            console.error('Invalid JSON or request failed', error);
        }
    };

    const renderResponse = () => {
        const filteredData = {};
        selectedOptions.forEach(option => {
            filteredData[option] = responseData[option];
        });
        return JSON.stringify(filteredData, null, 2);
    };

    return (
        <div className="container">
            <h1 className="title">ABCD123 API Tester</h1>
            <textarea 
                className="json-input"
                placeholder="Enter JSON input here..." 
                value={jsonInput} 
                onChange={handleJsonInputChange} 
            />
            <div className="controls">
                <button className="submit-button" onClick={handleSubmit}>Submit</button>
                <select 
                    multiple={true} 
                    className="dropdown" 
                    onChange={(e) => setSelectedOptions([...e.target.selectedOptions].map(option => option.value))}
                >
                    <option value="numbers">Numbers</option>
                    <option value="alphabets">Alphabets</option>
                    <option value="highest_lowercase_alphabet">Highest Lowercase Alphabet</option>
                </select>
            </div>
            <pre className="response">{renderResponse()}</pre>
        </div>
    );
};

export default App;
