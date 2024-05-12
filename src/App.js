import React, { useState } from 'react';
import './App.css';

function App() {
  const [filecontent, setFileContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [searchFrequency, setSearchFrequency] = useState(0);
  const [displayword, setDisplayword] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [words, setWords] = useState(0);
  const [display, setDisplay] = useState(false);
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type && !file.type.startsWith('text/')) {
        alert('Please select a text file.');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        setFileContent(reader.result);
        const wordCount = reader.result.split(/\s+/).filter(word => word !== "").length;
        setWords(wordCount);
      };

      reader.onerror = () => {
        console.log("File error:", reader.error);
      };
    }
  };

  const handleSearch = () => {
    performSearch();
    setIsSearchInputFocused(false);
  };

  const performSearch = () => {
    setDisplay(true)
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlightedContent = filecontent.replace(regex, '<mark>$1</mark>');
    setSearchResult(highlightedContent);
    const matches = filecontent.match(regex);
    setSearchFrequency(matches ? matches.length : 0);
    setDisplayword(searchTerm);
    setSearchTerm("");
    if (searchTerm) {
      const updatedHistory = [searchTerm, ...searchHistory.slice(0, 4)];
      setSearchHistory(updatedHistory);
    }
    setDisplay(false)
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
      setIsSearchInputFocused(false);
    }
  };

  return (
    <div className='bg-container m-3'>
  <div className='row justify-content-center'>
    <div className='col-md-8'>
      <div>
        <div className='card-header'>
          <h1>Text File Viewer</h1>
        </div>
        <div className='card-body'>
          <div className='file-input'>
            <input type="file" onChange={handleFileChange} />
          </div>
          <div className='search-container'>
            <div>
              <input
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchInputFocused(true)}
                onBlur={() => setIsSearchInputFocused(false)}
                onKeyPress={handleKeyPress}
                placeholder="Enter search term"
                value={searchTerm}
                className='search-input'
              />
              <div className={isSearchInputFocused? 'search-history-container active' : 'search-history-container'}>
                <ul>
                  {searchHistory.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <button className='search-btn' onClick={handleSearch}>Search</button>
            </div>
          </div>
          
          {filecontent && (
            <>
            <div className='pdf-view-container'>
              <p dangerouslySetInnerHTML={{ __html: searchResult || filecontent }} />
            </div>
            <div className='bottom-text'>
            Frequency of Word "{displayword}" is: {searchFrequency}
          </div>
          <div className='bottom-text'>
            Number of words in the Text File: {words}
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default App;
