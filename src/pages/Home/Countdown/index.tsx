import { useState, useEffect } from "react"
import { CountdownContainer, Separator } from "./styles"
import differenceInSeconds from "date-fns/differenceInSeconds"

interface CountdownProps {
    activeCycle: any;
    setCycles: any;
    activeCycleID: any;
}

export function Countdown( { activeCycle, setCycles, activeCycleID }: CountdownProps) {
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 


    useEffect(() => {
        let interval: number 

        if (activeCycle) {

            interval = setInterval(() => {
                const differenceInSec = differenceInSeconds(
                    new Date(), 
                    activeCycle.startDate,
                )
                if (differenceInSec >= totalSeconds){
                    setCycles( state => state.map(cycle => {
                            if (cycle.id === activeCycleID){
                                return {...cycle, finishedDate: new Date()}
                            } else {
                                return cycle
                            }
                        })
                    )

                    setAmountSecondsPassed(totalSeconds)
                    clearInterval(interval)
                    
                } else{
                    setAmountSecondsPassed(differenceInSec)
                }
            }, 1000)
            }
            return () => {
                clearInterval(interval)
            }
        }, [activeCycle, totalSeconds, activeCycleID])

    return(
        <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>
    )
}