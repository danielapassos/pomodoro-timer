import { FormContainer, MinutesAmountInput, TaskInput } from "./styles"
import * as zod from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"

export function NewCycleForm(){
    const { register, handleSubmit, watch, reset } = useForm <NewCycleFormData> ({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    const newCycleFormValidationSchema = zod.object({
        task: zod.string().min(1, 'Fill in the task'), 
        minutesAmount: zod.number().min(5, 'You need to focus for at least 5 minutes').max(60, 'You can focus for a max of 60 minutes'),
    })
    
    type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

    return(
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
    )
}