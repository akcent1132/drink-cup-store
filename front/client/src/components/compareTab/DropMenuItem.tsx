import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { useCallback, useState } from "react";

type Props = {
  onAddMain: () => void;
  mainLabel: string;
  onAddSubmenu: (value: string) => void;
  submenuValues: string[];
};

export const DropMenuItem = ({
  onAddMain,
  mainLabel,
  onAddSubmenu,
  submenuValues,
}: Props) => {
  const [isSubmenuOpen, setisSubmenuOpen] = useState(false);
  const toggleOpen = useCallback(
    (e) => {
      e.stopPropagation();
      setisSubmenuOpen(!isSubmenuOpen);
    },
    [isSubmenuOpen]
  );
  return (
    <>
      <MenuItem onClick={onAddMain} sx={{pr:1}}>
        {mainLabel} <Box flexGrow={1} />
        <Divider orientation="vertical" sx={{mx: 1}} flexItem />
        <IconButton size="small" onClick={toggleOpen} onMouseDown={e => e.stopPropagation()}>
          {isSubmenuOpen ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </MenuItem>
      <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
        {submenuValues.map((value) => (
          <MenuItem
            key={value}
            sx={{ pl: 4 }}
            onClick={() => onAddSubmenu(value)}
          >
            Filter {value}
          </MenuItem>
        ))}
      </Collapse>
    </>
  );
};
