import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, IconButton, List, ListItemButton, ListItemText, CssBaseline, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { PANELS } from '../gl/panels';
import { glManager } from '../gl/glManager';

const drawerWidth = 240;

export default function MainShell() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);

  useEffect(() => {
    glManager.init();
  }, []);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleToggle = () => setOpen(!open);

  const drawer = (
    <List>
      {PANELS.map((p) => (
        <ListItemButton
          key={p.key}
          onClick={(e) => {
            const newInstance = (e.metaKey || e.ctrlKey);
            glManager.open(p.key, { newInstance });
            if (isMobile) setOpen(false);
          }}
        >
          <ListItemText primary={p.title} />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={handleToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            FPApp
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={handleToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>
      <main style={{ flexGrow: 1, paddingTop: 64 }}>
        <div id="gl-root" style={{ height: '100%' }} />
      </main>
    </div>
  );
}
