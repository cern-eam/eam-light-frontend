import EntityCode from "../../../enums/EntityCode";

export function getLink(type, code) {

        switch (type) {
            case EntityCode.ASSET: {
                return '/asset/' + code;
            }

            case EntityCode.POSITION: {
                return '/position/' + code;
            }

            case EntityCode.SYSTEM: {
                return '/system/' + code;
            }

            case EntityCode.WORKORDER: {
                return '/workorder/' + code;
            }

            case EntityCode.PART: {
                return '/part/' + code;
            }

            case EntityCode.LOCATION: {
                return '/location/' + code;
            }
        }
}