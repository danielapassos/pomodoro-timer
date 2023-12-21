import { useContext } from "react";
import { HistoryContainer, HistoryList, Status } from "./styles";
import { CyclesContext } from "../../contexts/CyclesContext";
import { formatDistanceToNow } from 'date-fns'

export function History(){
    const { cycles } = useContext(CyclesContext)

    return(
        <HistoryContainer>
            <h1>My history</h1>
            
            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Duration</th>
                            <th>Start</th>
                            <th>End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cycles.map(cycle => {
                            return(
                                <tr key={cycle.id}>
                                <td>{cycle.task}</td>
                                <td>{cycle.minutesAmount} minutes</td>
                                <td>{formatDistanceToNow(cycle.startDate,{
                                    addSufix: true
                                })}</td>
                                <td>
                                    {cycle.finishedDate && (<Status statusColor="green">Finished</Status>)}
                                    {cycle.interrupedDate && (<Status statusColor="red">Interrupted</Status>)}
                                    {!cycle.finishedDate && !cycle.interrupedDate && (<Status statusColor="yellow">Happening now</Status>)}
                                </td>
                            </tr> 
                            )
                        })}
                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    )
}