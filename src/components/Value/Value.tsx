import React, { useState, useEffect } from 'react'
import CountUp from 'react-countup'
import BigNumber from 'bignumber.js'

import styled from 'styled-components'

interface ValueProps {
  value: string | number | object
  decimals?: number
}

const Value: React.FC<ValueProps> = ({ value, decimals }) => {
  const [start, updateStart] = useState(0)
  const [end, updateEnd] = useState(0)

  useEffect(() => {
    if (typeof value === 'number') {
      updateStart(end)
      updateEnd(value)
    }
  }, [value])

  return (
    <StyledValue fontSize={ typeof value === 'object' ? 30 : (new BigNumber(value).toNumber() > 1000000000 ? 28 : 30)}>
      {typeof value == 'string' ? (
        value
      ) : (
        <CountUp
          start={start}
          end={end}
          decimals={
            decimals !== undefined ? decimals : end == 0 ? 3 : (end < 0.01 ? 6 : end > 1e6 ? 0 : 3)
          }
          duration={1}
          separator=","
        />
      )}
    </StyledValue>
  )
}

interface StyledValueProps {
  fontSize: number
}

const StyledValue = styled.div<StyledValueProps>`
  font-family: 'Avenir Next Medium', sans-serif;
  // color: ${(props) => props.theme.color.grey[600]};
  color: #20C5A0;
  // color: #555A6A;
  font-size:  ${props => props.fontSize}px; 
  font-weight: 700;
  text-align: center;
`

export default Value
