import * as C from './styles';

type props = {
    label: string;
    value: string;
}
export const InfoItem = ({label, value}: props) => {
    return ( 
        <C.Container>
            <C.Label>{label}</C.Label>
            <C.Label>{value}</C.Label>
        </C.Container>

    );
}