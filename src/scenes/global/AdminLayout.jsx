import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { DarkModeOutlined,LightModeOutlined, NoEncryption } from '@mui/icons-material';
import { useDispatch } from "react-redux";
import { setMode } from "../../app/slices/globalSlice";
import Logo from '../../components/Logo'
import FlexBetween from '../../components/FlexBetween';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../app/hooks/userAuthRedirectionHook';
import {Navigate} from 'react-router-dom'
import {faGuitar,faMessage,faBell,faSearch,faTicket,faShop,faUser,faMusic} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { viewProfile } from '../../services/sidebarNavigation';


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  backgroundColor:theme.palette.mode == 'dark' ? '#000000' : 'white',
  overflowX: 'hidden',
  borderRight:'0.2px solid light'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor:theme.palette.mode == 'dark' ? '#000000' : 'white',
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  backgroundColor:theme.palette.mode == 'dark' ? '#000000' : 'white',
 

  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
 
  }),
  backgroundColor:theme.palette.mode == 'dark' ? '#000000' : '#f7f7f7',
  boxShadow:'none',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
 

  
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
  
    }),
    backgroundColor:theme.palette.mode == 'dark' ? '#000000' : 'white',
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),

  }),

);

export default function AdminLayout() {
const navigate = useNavigate()



  const dispatch = useDispatch();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  let width = open ? '85vw' : '95vw'
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} >
       
        <Toolbar>
          <div>
          <IconButton
           color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
             
              marginRight: 5,
              ...(open && { display: 'none' }),
             
            }}
          >
            <MenuIcon />
          </IconButton>

          <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode == "dark" ? (
                <DarkModeOutlined sx={{ fontSize: "25px" }} />
              ) : (
                <LightModeOutlined sx={{ fontSize: "25px" }} />
              )}
            </IconButton>
            </div>
         
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
   
        <DrawerHeader style={{height:'0.2rem'}}>
          <FlexBetween>
            <div style={{marginRight:'1rem'}}>
            <Logo/>
            </div>
    
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          </FlexBetween>
        </DrawerHeader>
        <Divider />
        
        <List>
    
            <ListItem key={'text'} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {   <FontAwesomeIcon style={{height:'20px', width:'20px'}} icon={faGuitar}/>} 
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} sx={{ opacity: open ? 1 : 0,fontSize:'20px' }} />
              </ListItemButton>
              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {   <FontAwesomeIcon style={{height:'20px', width:'20px'}} icon={faMessage}/>} 
                </ListItemIcon>
                <ListItemText primary={'Users'} sx={{ opacity: open ? 1 : 0,fontSize:'20px' }} />
              </ListItemButton>
              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {   <FontAwesomeIcon style={{height:'20px', width:'20px'}} icon={faBell}/>} 
                </ListItemIcon>
                <ListItemText primary={'Posts'} sx={{ opacity: open ? 1 : 0,fontSize:'20px' }} />
              </ListItemButton>
              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={()=>navigate('/search')}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {   <FontAwesomeIcon style={{height:'20px', width:'20px'}} icon={faSearch}/>} 
                </ListItemIcon>
                <ListItemText primary={'Notifications'} sx={{ opacity: open ? 1 : 0,fontSize:'20px' }} />
              </ListItemButton>
              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {   <FontAwesomeIcon style={{height:'20px', width:'20px'}} icon={faTicket}/>} 
                </ListItemIcon>
                <ListItemText primary={'Ticket Orders'} sx={{ opacity: open ? 1 : 0,fontSize:'20px' }} />
              </ListItemButton>
              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={()=>navigate('/melodytrade')}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {   <FontAwesomeIcon style={{height:'20px', width:'20px'}} icon={faShop}/>} 
                </ListItemIcon>
                <ListItemText primary={'Ticket Counter'} sx={{ opacity: open ? 1 : 0,fontSize:'20px' }} />
              </ListItemButton>

              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={()=>navigate('/melodytrade')}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {   <FontAwesomeIcon style={{height:'20px', width:'20px'}} icon={faShop}/>} 
                </ListItemIcon>
                <ListItemText primary={'Melody Trade'} sx={{ opacity: open ? 1 : 0,fontSize:'20px' }} />
              </ListItemButton>
              

              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={()=>navigate('/profile')}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {   <FontAwesomeIcon style={{height:'20px', width:'20px'}} icon={faUser}/>} 
                </ListItemIcon>
                <ListItemText primary={'Your Profile'} sx={{ opacity: open ? 1 : 0,fontSize:'20px' }} />
              </ListItemButton>

            </ListItem>
          
        </List>
      
      </Drawer>
   
      <Box component="main" sx={{ flexGrow: 1, p: 3, width:width}}>
        <DrawerHeader />
       



  <Outlet/> 
 
  
    
        
     
         
      </Box>
    
    </Box>
  );
}