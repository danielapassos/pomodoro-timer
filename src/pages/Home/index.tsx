import { HandPalm, Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, TaskInput, StopCountdownButton } from "./styles";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Fill in the task'), 
    minutesAmount: zod.number().min(5, 'You need to focus for at least 5 minutes').max(60, 'You can focus for a max of 60 minutes'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

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
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { register, handleSubmit, watch, reset } = useForm <NewCycleFormData> ({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleID)
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
                <FormContainer>
                    <label htmlFor="task">I am working on</label>
                    <TaskInput 
                        id="task" 
                        list="task-suggestions"
                        placeholder="Give your project a name"
                        disabled={!!activeCycle}
                        {...register('task')}
                        />
                    <datalist id="task-suggestions">
                        <option value="Project 1"/>
                        <option value="Project 2"/>
                        <option value="Project 3"/>
                    </datalist>
                    <label htmlFor="minutesAmount">during</label>
                    <MinutesAmountInput
                        type="number"
                        id="minutesAmount"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        disabled={!!activeCycle}
                        {...register('minutesAmount', {valueAsNumber: true})}
                    />
                    <span>minutes.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

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