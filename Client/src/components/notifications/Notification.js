const { defaultConfiguration } = require("express/lib/application");

const Notification = (props) => {
    const { notification } = props;

    if (!notification){
        return <></>
    }

    return (
        <div classnName="notification__item">
            <img src={`https://localhost:8000${notification.notification_image}`} alt="notification-avatar"/>
            <span>{notification.notification_message}</span>
        </div>
    );
};

export default Notification;