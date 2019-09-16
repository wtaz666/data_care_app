<div className="rank_chart">
    <ul className={flag ? 'rankUl1' : 'rankUl2'}>
        {(flag ? rankData1 : rankData2).map((k, y) => (
            <li className="clearfix" key={y} >
                <div className="list_item" style={{ width: k.zhanbi > 50 ? (k.zhanbi) + '%' : '100%', paddingRight: '10px' }}>
                    <div className="fl">{k.name}</div>
                    <div className="fr">{k.showValue}</div>
                </div>
                <div className="list_inner_box">
                    <div className="list_chart" style={{ width: k.zhanbi > 0 ? (k.zhanbi) + '%' : '0.01%', background: 'rgb(157, 174, 255)' }}>
                    </div>
                </div>
            </li>
        ))}
    </ul>
</div>
