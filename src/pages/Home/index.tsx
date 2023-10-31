import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, TaskInput } from "./styles";

export function Home() {
    return (
        <HomeContainer>
            <form action="">
                <FormContainer>
                    <label htmlFor="task">I am working on</label>
                    <TaskInput id="task" placeholder="Give your project a name" />
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
                    />
                    <span>minutes.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>


                <StartCountdownButton disabled type="submit">
                    <Play size={24} />
                    Start
                </StartCountdownButton>

            </form>
        </HomeContainer>
    )
}