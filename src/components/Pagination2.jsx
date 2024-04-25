import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function Pagination2({count,changePage,onPageChange,resetPage}) {
  const [page, setPage] = React.useState(1);
  React.useEffect(() => {
    if (resetPage) {
      console.log('Resetting page to 1');
      setPage(1);
    }
  }, [resetPage]);
  const handleChange = (event, value) => {
    setPage(value);
    onPageChange(value)
  
  
  };
 
  console.log(resetPage,'resetpage')


  return (
    <Stack spacing={2}>
      <Typography>Page: {page}</Typography>
      <Pagination resetPage={resetPage}  count={count} page={page} onChange={handleChange} />
    </Stack>
  );
}