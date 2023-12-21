import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { useContext } from 'react'
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Fill in the task'), 
    minutesAmount: zod.number().min(5, 'You need to focus for at least 5 minutes').max(60, 'You can focus for a max of 60 minutes'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


export function Home() {
    const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)

    const newCycleForm = useForm <NewCycleFormData> ({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    const { handleSubmit, watch, reset } = newCycleForm

    function handleCreateNewCycle(data: NewCycleFormData){
        createNewCycle(data)
        reset()
    }

    const task = watch('task')
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                        <FormProvider {...newCycleForm}>
                            <NewCycleForm/>
                        </FormProvider>
                    <Countdown/>
                
                { activeCycle ? (
                    <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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