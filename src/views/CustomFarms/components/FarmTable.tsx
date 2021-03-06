import React, { useContext, useMemo } from 'react'
import dayjs from 'dayjs'
import { useParams, Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import { makeStyles, withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import { getLogoURLByAddress } from '../../../utils/addressUtil'
import LocalLoader from '../../../components/LocalLoader'
import { getBalanceNumber } from '../../../utils/formatBalance'

import { CustomFarm } from '../../../contexts/CustomFarms'
import useCustomFarms from '../../../hooks/useCustomFarms'
import useAllStakedUSDValueForCustom from '../../../hooks/useAllStakedUSDValueForCustom'
import { NodeFarm } from '../../../contexts/NodeFarms'
import { Link } from 'react-router-dom'
import {isMobile} from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import LazyIcon from '../../../components/LazyIcon'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

interface FarmTableProps {
  dataSource?: [],
  stakeTokenType: 'lpToken' | 'singleToken'
}

const useStyles = makeStyles({
    root: {
        color: '#647684',
        textTransform: 'none',
        minWidth: 72,
        fontWeight: 700,
        marginRight: 20,
        fontSize: 20,
        '&:hover': {
          color: '#555A6A',
          opacity: 1,
        },
        '&$selected': {
          color: '#555A6A',
          fontWeight: 700,
        },
        '&:focus': {
          color: '#555A6A',
        },
        
    },
    table: {
    // minWidth: {window.innerWidth - 48},
    // minWidth: 300
    },
    indicator: {
        display: "none",
    }

});

interface FarmWithStakedValue extends CustomFarm {
    reserveUSD: BigNumber,
}

const FarmTable: React.FC<FarmTableProps> = ({dataSource, stakeTokenType}) => {
    const { t } = useTranslation()
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 25));
        setPage(0);
    };

    const [tabValue, setTabValue] = React.useState(0);
    const handleChange = (event: any, newTabValue: any) => {
        setTabValue(newTabValue);
    };

    const [customFarms] = useCustomFarms()
    const stakedValue = useAllStakedUSDValueForCustom()
    // console.log("FarmTable=====================>")
    // console.log(customFarms)
    // console.log("stakedValue=====================>")
    // console.log(stakedValue)

    const currentTime = new Date().getTime()/1000
    const rows = customFarms.reduce<FarmWithStakedValue[][]>(
        (farmRows, farm, i) => {
            const farmWithStakedValue = {
                ...farm,
                reserveUSD: stakedValue[i] ? stakedValue[i].stakingTokenUSDValue : null           
            }
       
            const newFarmRows = [...farmRows]
            
            if((stakeTokenType === 'lpToken' && farm.isStakingLPToken)  || 
                    (stakeTokenType === 'singleToken' && !farm.isStakingLPToken)){

                if(currentTime > farm.endTime) { // Finished
                    newFarmRows[2].push(farmWithStakedValue)    
                } else if(currentTime < farm.startTime) { // Upcoming
                    newFarmRows[1].push(farmWithStakedValue)    
                } else { // Live
                    newFarmRows[0].push(farmWithStakedValue)    
                } 
            }

            return newFarmRows
        },
        [[],[],[]],
    )
    
    return (
        <StyledTableContainer>
            <HeadDiv>
                <AntTabs value={tabValue} onChange={handleChange} aria-label="ant example">
                    <Tab className = {classes.root} label={t('Live')} />
                    <Tab className = {classes.root} label={t('Upcoming')} />
                    <Tab className = {classes.root} label={t('Ended')} />
                </AntTabs>
                {
                    isMobile ? (
                        <></>
                    ) : (
                        <CreateFarmDiv>
                            <StyledNomalLink  to={stakeTokenType === 'lpToken' ? '/customCreateLPMining' : '/customCreateSingleMining'} >
                                {t('Create Customized Mining Pool') + ' >'}
                            </StyledNomalLink>
                        </CreateFarmDiv>
                    )
                }
            </HeadDiv>
            <Table className={classes.table} aria-label="simple table">
            <TableBody>
                {   rows[tabValue].length === 0 ? (    
                        <TitleDiv>{ customFarms?.length === 0 ? t('Loading ...') : t('No Mining Pool Temporarily')}</TitleDiv>
                    ) :
                    (rows[tabValue].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((farm, j) => {
                            // let address = farm.tokenAddress
                            return (
                                // <StyledNavLink to={`/communityMining/`}>
                                    <StyledTableRow key={j}>
                                        <CardDiv>
                                            <TopDiv>
                                                <TopLeftDiv>
                                                    <LazyIcon address={farm.rewardsToken} customStyle={iconStyle}/>
                                                    {/* <StyledIcon src = {getLogoURLByAddress(farm.rewardsToken)} /> */}
                                                    <DetailDiv>
                                                        <TitleDiv>{farm.name}</TitleDiv>
                                                        <TitleDetailDiv>{t('Deposit')} <StyledSpan>{ 
                                                            stakeTokenType === 'lpToken' ?
                                                                ((farm.token0Symbol==='WNEW' ? 'NEW' : farm.token0Symbol) + '-' + (farm.token1Symbol==='WNEW' ? 'NEW' : farm.token1Symbol)) :
                                                                farm.stakingTokenSymbol==='WNEW' ? 'NEW' : farm.stakingTokenSymbol
                                                            }</StyledSpan>, {t('Earn')} <StyledSpan>{farm.rewardsTokenSymbol === 'WNEW' ? 'NEW' : farm.rewardsTokenSymbol}</StyledSpan></TitleDetailDiv>
                                                    </DetailDiv>
                                
                                                </TopLeftDiv>
                                                {
                                                    isMobile ? (
                                                        <></>
                                                    ) : (
                                                        <TopRightDiv>
                                                            <AwardDiv>{getBalanceNumber(new BigNumber(farm.rewardAmount), farm.rewardsTokenDecimals).toLocaleString('en-US')}</AwardDiv>
                                                            <AwardTip>{t('Total Rewards')}</AwardTip>
                                                        </TopRightDiv>  
                                                    )
                                                }                               
                                            </TopDiv>
                                            <Line></Line>
                                            <BottomDiv>
                                                { isMobile ? 
                                                    (
                                                        <TimeDiv>
                                                            <StakeTitle>{t('Total Rewards')}</StakeTitle>
                                                            <StakeValue>{getBalanceNumber(new BigNumber(farm.rewardAmount), farm.rewardsTokenDecimals).toLocaleString('en-US')}</StakeValue>    
                                                            <StakeTitle>{t('Total Stake Value')}</StakeTitle>
                                                            <StakeValue>{farm.reserveUSD
                                                                            ? `$${farm.reserveUSD
                                                                            .toNumber()
                                                                            .toLocaleString('en-US')}`
                                                                            : t('Loading ...')}</StakeValue>
                                                            <TimeTitle>{t('Stake Time')}</TimeTitle>
                                                            <TimeValue>{dayjs.unix(farm.startTime).format('YYYY-MM-DD HH:mm') + " - " + dayjs.unix(farm.endTime).format('YYYY-MM-DD HH:mm')}</TimeValue>
                                                            
                                                        </TimeDiv>
                                                      ) : (
                                                        <>
                                                        <TimeDiv>
                                                            <TimeTitle>{t('Stake Time')}</TimeTitle>
                                                            <TimeValue>{dayjs.unix(farm.startTime).format('YYYY-MM-DD HH:mm') + " - " + dayjs.unix(farm.endTime).format('YYYY-MM-DD HH:mm')}</TimeValue>
                                                        </TimeDiv>
                                                        <StakeDiv>
                                                            <StakeTitle>{t('Total Stake Value')}</StakeTitle>
                                                            <StakeValue>{farm.reserveUSD
                                                                            ? `$${farm.reserveUSD
                                                                            .toNumber()
                                                                            .toLocaleString('en-US')}`
                                                                            : t('Loading ...')}</StakeValue>
                                                        </StakeDiv>
                                                        </>
                                                      )
                                                }
                                                <EnterDiv>
                                                    <StyledNavLink to={`/customLPMining/${farm.id}`}>
                                                        <EnterBtn>
                                                            {t('Select')}
                                                        </EnterBtn>
                                                    </StyledNavLink>
                                                </EnterDiv>
                                            </BottomDiv>
                                        </CardDiv>
                                    </StyledTableRow>
                                // </StyledNavLink>
                            )
                        })
                    )
                }
                </TableBody>
            </Table>
            {/* <TablePagination
                // rowsPerPageOptions={[5, 10, 25]}
                rowsPerPageOptions={[25]}
                component="div"
                count={rows[tabValue].length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            /> */}
        </StyledTableContainer>
    )
}

const StyledTableRow = withStyles((theme) => ({
    root: {
      // '&:nth-of-type(odd)': {
      //   backgroundColor: theme.palette.action.hover,
      // },
      '&:hover': {
        // backgroundColor: theme.palette.action.hover,
      },
      // '&:hover': {
      //   background-color: red,
      // },
    },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
    head: {
      borderBottom: "1px solid #F8F8F8",
    },
    body: {
      borderBottom: "1px solid #F8F8F8"
    },
    root: {
       paddingLeft: "0px",
       paddingRight: "0px"
    }

}))(TableCell);

// const StyledTH = styled.span`
//     margin-left: 30px;
// `
// const StyledTHMobile = styled.span`
//     margin-left: 16px;
// `
 
const StyledTableContainer = withStyles((theme) => ({
    root: {
      boxShadow: "0 #fff"
    }
}))(TableContainer);

const HeadDiv = styled.div`
    height: 50px;
    width: 100%;
    background: clear;
    margin-bottom: 10px;
`

const AntTabs = withStyles({
    root: {
      borderBottom: '0px solid #e8e8e8',
      float: 'left'
    },
    indicator: {
        display: 'none'
    }
})(Tabs);

const StyledSpan = styled.span`
    color: #20C5A0;
`

const CreateFarmDiv = styled.button`
    font-size: 16px;
    color: #20C5A0;
    font-weight: 700;
    float: right;
    background: #F6FCFA;
    border: none;
    margin-top: 10px;
    cursor: pointer;

    &:focus {
        border: none;
        outline: none;
        
    }
`

const CardDiv = isMobile ? styled.div`
    height: 225px;
    width: 100%;
    border-radius: 24px;
    background: white;
    margin-bottom: 30px;
    border-radius: 12px;
    box-shadow: 0px 3px 12px 0px rgba(7,94,68,0.11);
` : styled.div`
    height: 166px;
    width: 100%;
    border-radius: 24px;
    background: white;
    margin-bottom: 30px;
    border-radius: 12px;
    box-shadow: 0px 3px 12px 0px rgba(7,94,68,0.11);
`


const TopDiv = styled.div`
    background: clear;
    width: 100%;
    height: 90px;
`

const TopLeftDiv = styled.div`
    background: clear;
    height: 100%;
    float: left;
    display: flex;
    flex-direction: row;
`
const StyledIcon = styled.img `
    height: 45px;
    width: 45px;
    border-radius: 22.5px;
    margin-top: 28px;
    margin-left: 20px;
`

const iconStyle: React.CSSProperties = {
    width: '45px',
    height: '45px',
    borderRadius: '22.5px',
    marginLeft: '20px',
    marginTop: '28px',
  }

const DetailDiv = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-left: 8px;
`
const TitleDiv = styled.div`
    font-size: 18px;
    margin-top: 25px;
    color: #647684;
`

const TitleDetailDiv = styled.div`
    font-size: 14px;
    color: #647684;
    font-weight: 700;
`

const TopRightDiv = styled.div`
    background: clear;
    height: 100%;
    float: right;
    margin-right: 20px;
`

const AwardDiv = styled.div`
    margin-top: 25px;
    color: #20C5A0;
    font-size: 20px;
`

const AwardTip = styled.div`
    color: #647684;
    font-size: 14px;
    text-align: right;
`
const Line = styled.div`
    background: #F2F2F7;
    height: 1px;
    width: calc(100%-40px);
    margin-left: 20px;
    margin-right: 20px;
`

const BottomDiv = styled.div`
    background: clear;
    width: 100%;
    height: 94px;
    position: relative;
`

const TimeDiv = styled.div`
    background: clear;
    height: 100%;
    float: left;
    margin-top: 10px;
    margin-left: 20px;
`

const TimeTitle = isMobile ? styled.div`
    font-size: 12px;
    color: #647684;
` : styled.div`
    font-size: 14px;
    color: #647684;
`
const TimeValue = isMobile ? styled.div`
    font-size: 12px;
    color: #647684;
    font-weight: 700;
` : styled.div`
    ont-size: 14px;
    color: #647684;
    font-weight: 700;
`


const StakeDiv = styled.div`
    background: clear;
    height: 100%;
    float: left;
    margin-top: 10px;
    margin-left: 80px;
`

const StakeTitle = styled.div`
    font-size: 14px;
    color: #647684;
`
const StakeValue = styled.div`
    font-size: 14px;
    color: #20C5A0;
    font-weight: 700;
`

const EnterDiv = isMobile ? styled.div`
    background: clear;
    height: 100%; 
    position: absolute;
    top: 35px;
    right: 0;
` : styled.div`
    background: clear;
    height: 100%;
    float: right;
    margin-top: 16px;
`

const EnterBtn = styled.button`
    background: #20C5A0;
    border-radius: 12px;
    height: 36px;
    width: 100px;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 0px;
    margin-right: 16px;

    &:focus {
        border: none;
        outline: none;
        
    }
`
const StyledNavLink = styled(Link)`
    align-items: center;
    font-size: 14px;
    color: white;
    
    text-decoration: none;
`

const StyledNomalLink = styled(Link)`
    align-items: center;
    font-size: 14px;    
    text-decoration: none;
    color: #20C5A0;
`


export default FarmTable