import { ReactNode, createContext, useState, useReducer } from "react"

interface CycleContextProviderProps{
    children: ReactNode
}

interface CreateCycleData{
    task: string
    minutesAmount: number
}

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interrupedDate?: Date;
    finishedDate?: Date;
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
    const [cycles, dispatch] = useReducer((state:Cycle[], action: any) => {
        
        if (action.type === 'ADD_NEW_CYCLE') {
            return [... state, action.payload.newCycle]
        }
        return state
    }, [])

    const [activeCycleID, setactiveCycleID] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleID)

    function setSecondsPassed(seconds:number){
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished(){
        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleID
            }
        })
    //     setCycles( state => state.map(cycle => {
    //         if (cycle.id === activeCycleID){
    //             return {...cycle, finishedDate: new Date()}
    //         } else {
    //             return cycle
    //         }
    //     })
    // )
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
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle,
            }
        })
        // setCycles( (state) => [...state, newCycle])
        setactiveCycleID(id)
        setAmountSecondsPassed(0)

    }

    function interruptCurrentCycle (){
        dispatch({
            type: 'INTERRUPT_CURRENT_CYCLE',
            payload: {
                activeCycleID,
            }
        })

        // setCycles( (state) =>
        //     state.map(cycle => {
        //         if (cycle.id === activeCycleID){
        //             return {...cycle, interrupedDate: new Date()}
        //         } else {
        //             return cycle
        //         }
        //     })
        // )
        setactiveCycleID(null)
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
