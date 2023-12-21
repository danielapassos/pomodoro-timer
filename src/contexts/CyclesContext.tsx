import { ReactNode, createContext, useState, useReducer } from "react"
import {Cycle, cyclesReducer, ActionTypes} from '../reducers/cycles'

interface CycleContextProviderProps{
    children: ReactNode
}

interface CreateCycleData{
    task: string
    minutesAmount: number
}


interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleID: string | null
    markCurrentCycleAsFinished: () => void
    amountSecondsPassed: number
    setSecondsPassed:(seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
  }

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({children}:CycleContextProviderProps){
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleID: null,
    })

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { cycles, activeCycleID } = cyclesState


    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleID)

    function setSecondsPassed(seconds:number){
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished(){
        dispatch({
            type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
            payload: {
                activeCycleID
            }
        })
    }

    function createNewCycle(data: CreateCycleData){
        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch({
            type: ActionTypes.ADD_NEW_CYCLE,
            payload: {
                newCycle,
            }
        })

        setAmountSecondsPassed(0)

    }

    function interruptCurrentCycle (){
        dispatch({
            type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
            payload: {
                activeCycleID,
            }
        })

    }


    return(
        <CyclesContext.Provider 
        value={{ 
            cycles,
            activeCycle, 
            activeCycleID, 
            markCurrentCycleAsFinished, 
            amountSecondsPassed, 
            setSecondsPassed,
            createNewCycle,
            interruptCurrentCycle            
            }}>
            {children}
        </CyclesContext.Provider>
    )
}
