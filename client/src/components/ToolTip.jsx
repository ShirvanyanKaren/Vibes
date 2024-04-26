import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';



const ToolTip = (props) => {
console.log(props.bubbleStyle)


const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        maxWidth: 400,
        fontSize: theme.typography.pxToRem(12),
        position: 'relative',
        border: '1px solid #dadde9',
    },
    }));

    return (
        <HtmlTooltip
        title={
            <React.Fragment>
            <Typography 
            // style={{ color: 'white', fontSize: '24px' }}
            color="inherit">
                <span className='fw-bold tool-tip-header'> Ask Grok About {props.name}</span>
                </Typography>
                
            <em
                // style={{ color: 'white', fontSize: '20px' }}
                className='tool-tip mt-2'
                dangerouslySetInnerHTML={{ __html: `Number of Tweets: ${Math.ceil(props.proportion * 200)}` }

                }
            />
            </React.Fragment>
        }
        >
       <div className="bubble-entry" style={props.bubbleStyle} >
            {props.name}
        </div>


        </HtmlTooltip>
    );
    }

export default ToolTip;