import React, { useEffect, useState } from 'react';
import Style from './AppSider.module.less';
import floorIcon from '@/assets/icon/floorIcon.png';
import floorIconActive from '@/assets/icon/floorIconActive.png';
import searchIcon from '@/assets/icon/searchIcon.png';
import searchIconActive from '@/assets/icon/searchIconActive.png';
import { useNavigate, useLocation } from 'react-router-dom';

const AppSider = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [curSelect, setCurSelect] = useState('floor');

    useEffect(() => {
        const pathname = location.pathname;
        const pathParts = pathname.split('/').filter(Boolean);
        const key = pathParts.length > 1 ? pathParts[1] : 'floor';
        setCurSelect(key);
    }, [location]);

    const handleSelect = (key) => {
        setCurSelect(key);
        navigate(`/home/${key}`);
    }

    return (
        <div className={Style.wapper}>
            <div className={Style.menuItem} onClick={() => handleSelect('floor')}>
                <img className={Style.menuItemIcon} src={curSelect === 'floor' ? floorIconActive : floorIcon}/>
                <div className={`${Style.menuItemTitle} ${curSelect === 'floor' ? Style.active : ''}`}>楼层导览</div>
            </div>
            <div className={Style.menuItem} onClick={() => handleSelect('search')}>
                <img className={Style.menuItemIcon} src={curSelect === 'search' ? searchIconActive : searchIcon}/>
                <div className={`${Style.menuItemTitle} ${curSelect === 'search' ? Style.active : ''}`}>智能搜索</div>
            </div>
        </div>
    );
};

export default AppSider;
