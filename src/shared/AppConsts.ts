export class AppConsts {
    static SyncApiOptions = [
        {
            id: 1,
            Name: "Economic"
        },
        {
            id: 2,
            Name: "Billy"
        }
    ];
    static remoteServiceBaseUrl: string;
    static appBaseUrl: string;
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish
    static dateFormate = "yyyy-MM-dd";
    static localeMappings: any = [];
    //static defaultImageUrl = 'assets/img/companyLogo.png';
    static defaultImageUrl  ="https://www.svgrepo.com/show/335206/add-image.svg";
    static maxImageSize = 2000000;
    static allowedImageTypes = ['image/png', 'image/jpeg'];
    static defaultItemCode="003-132";
    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'Optician'
    };

    static readonly authorization = {
        encryptedAuthTokenName: 'enc_auth_token'
    };
}

export class UserTypes {
    static readonly Customer = 'Customer';
    static readonly Employee = 'Employee';
    static readonly Supplier = 'Supplier';
}


export class activityTypes {
    static readonly eyeTool = 'Eye test  (A1)';
    static readonly sale = 'Sale (A3)';
    static readonly SmsNoteActivityType = "SMS Note";
    static readonly EmailNoteActivityType = "Email Note";
    static readonly PhoneCallActivityType = "Phone Call Note";
    static readonly EilepsySale = "Eilepsy Sale";
    static readonly Ticket = "Ticket";
    static readonly ReceivePackage = "Recieve Package";
}

export class BookingEmployeeStatus {
    static readonly Pending = 'Pending';
    static readonly Accepted = 'Accepted';
    static readonly NotAllowed = 'NotAllowed';
    static readonly Rejected = 'Rejected';
}

export class inviteReponse {
    static readonly declined = 0;
    static readonly accepted = 1;
    static readonly pending = 2;
}

export class Screen {
    static readonly Customer = 1;
    static readonly Product = 2;
}
export class CustomFieldType {
    static readonly Numeric = 1;
    static readonly String = 2;
}
export class FaultStatuses {
    static readonly Open = 0;
    static readonly Close = 1;
    static readonly Resolved = 2;
}
export class TicketStatuses {
    static readonly Open = 1;
    static readonly RMA = 2;
    static readonly Resolved = 3;
}

export class TenancyNames {
    static readonly Test = 'Alert-it';
    static readonly Optician = 'Alert-it';
    static readonly HTFire = 'htfire';
}

export class PageMode {
    static readonly View = 'View';
    static readonly Edit = 'Edit';
    static readonly Add = 'Add';
}
