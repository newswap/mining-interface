import gql from 'graphql-tag'

export const ALL_TOKEN_MINES = gql`
  query tokenMines($skip: Int!) {
    tokenMines(first: 500, skip: $skip, orderBy: startTime, orderDirection: asc) {
      id
      owner
      name
      stakingToken
      rewardsToken
      startTime
      endTime
      rewardAmount
      stakingTokenSymbol
      stakingTokenName
      stakingTokenDecimals
      rewardsTokenSymbol
      rewardsTokenName
      rewardsTokenDecimals
      isStakingLPToken
      token0Address
      token0Symbol
      token0Name
      token0Decimals
      token1Address
      token1Symbol
      token1Name
      token1Decimals
      createdAtTimestamp
      createdAtBlockNumber
    }
  }
`

export const ALL_PAIRS = gql`
  query pairs($skip: Int!) {
    pairs(first: 500, skip: $skip, orderBy: trackedReserveETH, orderDirection: desc) {
      id
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
  }
`

export const ALL_TOKENS = gql`
  query tokens($skip: Int!) {
    tokens(first: 500, skip: $skip, orderBy: totalLiquidity, orderDirection: desc) {
      id
      name
      symbol
      derivedETH
      totalLiquidity
    }
  }
`