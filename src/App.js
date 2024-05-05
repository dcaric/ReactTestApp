import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, CssBaseline, Toolbar, AppBar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import GroupIcon from '@mui/icons-material/Group';
import { GroupPicker } from './GroupPicker';
import MapIcon from '@mui/icons-material/Map';
import Map from './Map';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('home');
  const [selectedKey, setSelectedKey] = useState({
    "name": "test2",
    "value": "test2"
  });

  const data = {
    groupName: "handoveGroup",
    legendData: [
      {
        "name": "test1",
        "value": "test1"
      },
      {
        "name": "test2",
        "value": "test2"
      }
    ]
  };

  const [selectedKey2, setSelectedKey2] = useState({
    "name": "test3",
    "value": "test3"
  });

  const data2 = {
    groupName: "handoveGroup",
    legendData: [
      {
        "name": "test3",
        "value": "test3"
      },
      {
        "name": "test4",
        "value": "test4"
      }
    ]
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleMenuItemClick = (componentName) => {
    setSelectedComponent(componentName);
    setIsDrawerOpen(false);
  };

  // Function to handle selection change in GroupPicker
  const handleChangeFactory = (setter) => (selectedKey) => {
    console.log('selectedKey:', selectedKey);
    setter(selectedKey);
  };
  
  const menuItems = [
    { text: 'Inbox', icon: <InboxIcon />, componentName: 'inbox' },
    { text: 'Mail', icon: <MailIcon />, componentName: 'mail' },
    { text: 'Group Picker', icon: <GroupIcon />, componentName: 'groupPicker' },
    { text: 'Group Picker2', icon: <GroupIcon />, componentName: 'groupPicker2' },
    { text: 'Map', icon: <MapIcon />, componentName: 'map' },


  ];

  return (
    <div className="App">
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="temporary" open={isDrawerOpen} onClose={handleDrawerToggle}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={item.text} onClick={() => handleMenuItemClick(item.componentName)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className="App-content" style={{ padding: '0 16px', marginTop: '64px' }}>
        {selectedComponent === 'groupPicker' && <GroupPicker groupName={data.groupName} legendData={data.legendData} selectedKey={selectedKey} onChange={handleChangeFactory(setSelectedKey)} />}
        {selectedComponent === 'groupPicker2' && <GroupPicker groupName={data2.groupName} legendData={data2.legendData} selectedKey={selectedKey2} onChange={handleChangeFactory(setSelectedKey2)} />}
        {selectedComponent === 'inbox' && <div>Inbox Content</div>}
        {selectedComponent === 'mail' && <div>Mail Content</div>}
        {selectedComponent === 'home' && (
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>Edit <code>src/App.js</code> and save to reload.</p>
            <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
              Learn React
            </a>
          </header>
        )}
        {selectedComponent === 'map' && <Map />}
      </main>
    </div>
  );
}

export default App;
