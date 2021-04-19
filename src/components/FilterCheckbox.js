import React, {useState} from 'react';
import "./FilterCheckbox.css";

export default function FilterCheckbox() {
    const representingTag = '';

    const [isChecked, setIsChecked] = useState("");
    return (
        <>
            <input
                className="filterCheckbox"
                type="checkbox"
                value={representingTag}
                onChange={(e) => setIsChecked(e.target.value)}
            />
            <label>This is a checkbox</label>
        </>
    );
}
