import React, {memo, useMemo} from "react";
import clsx from "clsx";

import { Menu } from "@mui/material";
import { MenuItem } from "@mui/material";

import styles from './CustomMenu.module.scss';

const CustomMenu = memo(({ open, buttonRef, onClose, menuItemsData }) => {
    const renderMenuItems = useMemo(() => {
        return menuItemsData.map(({ id, onClick, className, Component }) => {
            return (
                <MenuItem
                    key={id}
                    onClick={onClick}
                    className={clsx(styles.item, className)}
                >
                    {Component}
                </MenuItem>
            );
        })
    }, []);

  return (
      <Menu
          open={open}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          anchorEl={buttonRef?.current}
          classes={{ paper: styles.menu }}
          onClose={onClose}
      >
          {renderMenuItems}
      </Menu>
  )
})

export default CustomMenu;