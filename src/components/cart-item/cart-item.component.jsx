import './cart-item.styles.scss'

const CartItem = () => {
    const { name } = ({ cartItem }) => {
        const { name, quantity } = cartItem;
    }
    return (
        <div>
            <h2>{name}</h2>

        </div>
    )
}


export default CartItem;