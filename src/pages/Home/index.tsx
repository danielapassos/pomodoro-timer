import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, Separator, StartCountdownButton } from "./styles";

export function Home(){
    return(
        <HomeContainer>
            <form action="">
                <FormContainer>
                    <label htmlFor="task">I am working on</label>
                    <input id="task" />
                    <label htmlFor="minutesAmount">during</label>
                    <input type="number" id="minutesAmount" />
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
                <Play size={24}/>
                Start 
            </StartCountdownButton>

            </form>
        </HomeContainer>
    )
}