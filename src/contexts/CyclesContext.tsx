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

interface CyclesState {
    cycles: Cycle[];
    activeCycleID: string | null;
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({children}:CycleContextProviderProps){
    const [cyclesState, dispatch] = useReducer((state:CyclesState, action: any) => {
        
        switch(action.type){
            case 'ADD_NEW_CYCLE':
                return {
                    ...state, 
                    cycles: [...state.cycles, action.payload.newCycle],
                    activeCycleID: action.payload.newCycle.id,
                }

            case 'INTERRUPT_CURRENT_CYCLE':
                return {
                    ...state,
                    cycles: state.cycles.map(cycle => {
                                if (cycle.id === state.activeCycleID){
                                    return {...cycle, interrupedDate: new Date()}
                                } else {
                                    return cycle
                                }
                            }),
                        activeCycleID: null,

                }

            case 'MARK_CURRENT_CYCLE_AS_FINISHED':
                return{
                    ...state,
                    cycles: state.cycles.map(cycle => {
                        if (cycle.id === state.activeCycleID){
                            return {...cycle, finishedDate: new Date()}
                        } else {
                            return cycle
                        }
                    })}

            default:
                return state
        }        
    }, {
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
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
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
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle,
            }
        })

        setAmountSecondsPassed(0)

    }

    function interruptCurrentCycle (){
        dispatch({
            type: 'INTERRUPT_CURRENT_CYCLE',
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
