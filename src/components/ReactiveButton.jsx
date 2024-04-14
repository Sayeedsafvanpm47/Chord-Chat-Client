import { useTheme } from '@mui/material';
import ReactiveButton from 'reactive-button';
function Button({text,loadingText,onClickHandler,state,color,mode})
{
          const theme = useTheme()
          return (
                    <ReactiveButton style={{fontFamily:theme.typography.fontFamily.match('Roboto'), fontWeight:'400'}}
                      buttonState={state}
                      idleText={text}
                      loadingText={loadingText}
                      successText="Done"
                      onClick={onClickHandler?onClickHandler:''}
                      color = {color}
                      rounded
                    />
                  );
}

export default Button