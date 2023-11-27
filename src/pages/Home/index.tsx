import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import { Countdown } from "./Countdown";
import { NewCycleForm } from "./NewCycleForm";

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interrupedDate?: Date;
    finishedDate?: Date;
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleID, setactiveCycleID] = useState<string | null>(null)
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleID)

    

    function handleCreateNewCycle(data: NewCycleFormData){
        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles( (state) => [...state, newCycle])
        setactiveCycleID(id)
        setAmountSecondsPassed(0)

        reset()
    }

    function handleInterruptCycle (){
        setCycles( state =>
            state.map(cycle => {
                if (cycle.id === activeCycleID){
                    return {...cycle, interrupedDate: new Date()}
                } else {
                    return cycle
                }
            })
        )
        setactiveCycleID(null)
    }

    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    const task = watch('task')
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <NewCycleForm/>
                <Countdown 
                    activeCycle={activeCycle} 
                    setCycles={setCycles} 
                    activeCycleID={activeCycleID}
                />
                
                { activeCycle ? (
                    <StopCountdownButton onClick={handleInterruptCycle} type="button">
                    <HandPalm size={24} />
                    Interrupt
                </StopCountdownButton>
                ) : (
                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24} />
                    Start
                </StartCountdownButton>
                )}

                

            </form>
        </HomeContainer>
    )
}