import { ReactNode, createContext, useState, useReducer } from "react"
import { ActionTypes, addNewCycleAction, interruptCycleAction, markCycleFinishedAction } from "../reducers/cycles/actions"
import { Cycle, cyclesReducer} from '../reducers/cycles/reducer'

interface CycleContextProviderProps{
    children: ReactNode
}

interface CreateCycleData{
    task: string
    minutesAmount: number
}

export const CyclesContext = createContext({} as CyclesContextType)

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
        dispatch(markCycleFinishedAction)
    }

    function createNewCycle(data: CreateCycleData){
        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
          }
      
          dispatch(addNewCycleAction(newCycle))
      
          setAmountSecondsPassed(0)
        }
      
        function interruptCurrentCycle() {
          dispatch(interruptCycleAction())
        }
      
        return (
          <CyclesContext.Provider
            value={{
              cycles,
              activeCycle,
              activeCycleID,
              markCurrentCycleAsFinished,
              amountSecondsPassed,
              setSecondsPassed,
              createNewCycle,
              interruptCurrentCycle,
            }}
          >
            {children}
          </CyclesContext.Provider>
        )
      }
      