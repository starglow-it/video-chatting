import React, { memo } from "react";
import clsx from "clsx";

import { CustomGrid } from "../../custom";
import { SearchIcon } from "../../../icons";
import { InputBase } from "@mui/material";

import styles from './CustomSearch.module.scss';
import {CustomSearchProps} from "./CustomSearch.types";

const Component = ({ Icon, placeholder, onChange, value, className }: CustomSearchProps) => {
    return (
        <CustomGrid container alignItems="center" gap={1} className={clsx(styles.searchWrapper, className)} wrap="nowrap">
            {Icon ?? <SearchIcon width="28px" height="28px" />}
            <InputBase
                placeholder={placeholder}
                classes={{
                    root: styles.inputWrapper,
                    input: styles.input,
                }}
                value={value}
                onChange={onChange}
            />
        </CustomGrid>
    );
}

const CustomSearch = memo(Component);

export default CustomSearch;