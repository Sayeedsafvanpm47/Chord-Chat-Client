import React from 'react'
import '../assets/css/searchBar.css'
import axios from 'axios'
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';

const SearchBar = ({width,text,onSearch,id}) => {
          const theme = useTheme()
          const isMobile = useMediaQuery(theme.breakpoints.down('md'));
          const styles = {
                    container: {
                      width: isMobile ? '100%' : width, // Use theme breakpoints for responsiveness
                    },
                  };
          const handleChange = (event) => {
                    event.preventDefault();
                    onSearch(event.target.value); // Pass the value to the parent's onSearch prop
                  };
                
  return (
          <div className="form-control" style={styles.container}>
          <input style={{ width: '100%' }} onChange={handleChange} className="input input-alt" placeholder={text} required="" type="text"/>
          <span className="input-border input-border-alt"></span>
        </div>
        
  )
}

export default SearchBar