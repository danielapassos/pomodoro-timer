import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { createContext, useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interrupedDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    activeCycle: Cycle | undefined
    activeCycleID: string | null
    markCurrentCycleAsFinished: () => void
    amountSecondsPassed: number
    setSecondsPassed:(seconds: number) => void
  }

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Fill in the task'), 
    minutesAmount: zod.number().min(5, 'You need to focus for at least 5 minutes').max(60, 'You can focus for a max of 60 minutes'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleID, setactiveCycleID] = useState<string | null>(null)
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleID)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    

    const newCycleForm = useForm <NewCycleFormData> ({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    const { handleSubmit, watch, reset } = newCycleForm

    function markCurrentCycleAsFinished(){
        setCycles( state => state.map(cycle => {
            if (cycle.id === activeCycleID){
                return {...cycle, finishedDate: new Date()}
            } else {
                return cycle
            }
        })
    )
    }

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

    function setSecondsPassed(seconds:number){
        setAmountSecondsPassed(seconds)
    }

    const task = watch('task')
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <CyclesContext.Provider 
                    value={{ activeCycle, activeCycleID, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed }}
                    >
                        <FormProvider {...newCycleForm}>
                            <NewCycleForm/>
                        </FormProvider>
                    <Countdown/>
                </CyclesContext.Provider>
                
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