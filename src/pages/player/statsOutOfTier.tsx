import * as React from "react";
import { GridContainer, GridStat } from "./grid-container";
import { getGridData } from "./grid-data";
import { MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { tiers } from "../../common/constants/tiers";

type Props = {
    stats: any
}


export const StatsOutOfTier = ( { stats }: Props ) => {
    const [ isExpanded, setIsExpanded ] = React.useState(false);
    const tier = tiers.find( t => t.name === stats.tier)
    
    return (
        <div className={`width-full border rounded-md border-${tier?.color}-600`}>
            <div className="flex justify-center" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="pt-1">{ isExpanded ? <MdKeyboardArrowRight size="1.5em" className='leading-8 pl-1' /> : <MdKeyboardArrowDown size="1.5em" className='leading-8 pl-1' /> }</div>
                <h1 className={`text-xl text-center text-${tier?.color}-600`}>{stats.tier} <span className="text-xs text-gray-400"><i> Non-primary Tier - {stats.stats.gameCount} games played</i></span></h1>
                <div className="pt-1">{ isExpanded ? <MdKeyboardArrowLeft size="1.5em" className='leading-8 pl-1' /> : <MdKeyboardArrowDown size="1.5em" className='leading-8 pl-1' /> }</div>
            </div>
            { isExpanded && 
            <div className="py-2">
                {Array(Math.ceil(getGridData(stats.stats).length / 2)).fill(0).map((_, i) => {
                    const pair = getGridData(stats.stats).slice(i * 2, (i + 1) * 2);
                    return (
                        <React.Fragment key={`pair-${i}`}>
                            <GridContainer>
                                {pair.map((section, sectionIndex) => (
                                    <div key={`section-${i * 2 + sectionIndex}`} className="grid grid-cols-1 gap-2 p-2 h-fit">
                                        {section.map(({ name, value }, statIndex) => (
                                            <GridStat
                                                key={`stat-${i * 2 + sectionIndex}-${statIndex}`}
                                                name={name}
                                                value={value}
                                                rowIndex={statIndex} // pass statIndex instead of i
                                            />
                                        ))}
                                    </div>
                                ))}
                            </GridContainer>
                            {i < Math.ceil(getGridData(stats.stats).length / 2) - 1 && <br />}
                        </React.Fragment>
                    );
                })}
            </div>
            }
        </div>
    );
}