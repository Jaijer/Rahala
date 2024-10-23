import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import useSearchStore from '../../../stores/searchStore';

function SortByBtn() {
    const { sortBy, setSortBy } = useSearchStore(); // Access state from the store

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    className="capitalize bg-beige border-2 border-darkGreen rounded-full font-semibold px-6 text-lg"
                >
                    {sortBy}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={new Set([sortBy])} // Ensure the selected sort option is shown
                onSelectionChange={(selectedKeys) => setSortBy([...selectedKeys][0])} // Update store
            >
                <DropdownItem key="الأشهر">الأشهر</DropdownItem>
                <DropdownItem key="الأقل سعراً">الأقل سعراً</DropdownItem>
                <DropdownItem key="الأقرب">الأقرب</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}

export default SortByBtn;
