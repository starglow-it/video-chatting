import React, { ForwardedRef, forwardRef, memo } from 'react';

import { CommonIconProps } from '../types';

import { SvgIconWrapper } from './SvgIconWrapper';

const LiveOfficeLogo = memo(
    forwardRef(
        (
            { width, height, className, onClick }: CommonIconProps,
            ref: ForwardedRef<SVGSVGElement>,
        ) => {
            return (
                <SvgIconWrapper
                    ref={ref}
                    width={width}
                    height={height}
                    className={className}
                    onClick={onClick}
                    viewBox="0 0 210 44"
                    fill="none"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M155.117 21.9998C155.117 28.5088 151.592 30.8439 148.711 31.6304L148.476 31.6916C148.437 31.7013 148.398 31.7106 148.36 31.7197L148.13 31.7711L147.904 31.8163C147.867 31.8233 147.83 31.8301 147.793 31.8366L147.574 31.8732L147.361 31.9044L147.154 31.9305L146.954 31.952L146.76 31.9691L146.574 31.9821L146.396 31.9914L146.227 31.9972L146.066 32H145.913L145.753 31.9972L145.583 31.9914L145.405 31.9821L145.219 31.9691L145.026 31.952L144.825 31.9305L144.618 31.9044L144.405 31.8732L144.186 31.8366C144.15 31.8301 144.112 31.8233 144.075 31.8163L143.849 31.7711L143.619 31.7197C143.581 31.7106 143.542 31.7013 143.503 31.6916L143.268 31.6304C140.387 30.8439 136.862 28.5088 136.862 21.9998C136.862 15.2034 140.706 12.9577 143.646 12.2741L143.873 12.2239C143.911 12.2161 143.948 12.2085 143.985 12.2011L144.206 12.1599C144.243 12.1535 144.279 12.1473 144.315 12.1413L144.528 12.1083L144.736 12.0803L144.937 12.057L145.132 12.0382L145.32 12.0235L145.5 12.0126L145.672 12.0052L145.913 12H146.066L146.227 12.0028L146.396 12.0086L146.666 12.0239L146.856 12.039L147.053 12.0582L147.257 12.082C147.326 12.0907 147.396 12.1002 147.467 12.1106L147.683 12.1444C147.719 12.1505 147.756 12.1568 147.793 12.1634L148.016 12.2056C148.092 12.2207 148.168 12.2368 148.244 12.2539L148.476 12.3084C151.397 13.0314 155.117 15.3131 155.117 21.9998ZM196.704 17.0529L196.872 17.0545L197.042 17.0594L197.215 17.068L197.389 17.0802L197.564 17.0963L197.741 17.1165C197.771 17.1203 197.801 17.1241 197.83 17.1282L198.009 17.1549L198.189 17.1861L198.369 17.2221L198.549 17.2629C198.609 17.2773 198.669 17.2926 198.729 17.3088L198.91 17.36C199.09 17.4139 199.269 17.4759 199.447 17.5469L199.624 17.621C201.596 18.4819 203.318 20.4971 203.318 24.8045V25.4659H193.661L193.696 25.7953L193.711 25.9174L193.739 26.1098L193.761 26.2433L193.787 26.3801L193.818 26.5196L193.853 26.661L193.894 26.8038C193.901 26.8277 193.909 26.8515 193.916 26.8755L193.966 27.0189C194.317 27.9748 195.1 28.9049 196.969 28.9049C198 28.9049 199.059 28.3761 199.35 27.3706H203.159C202.18 30.7571 199.376 31.8679 196.969 31.8679L196.724 31.8654C196.684 31.8646 196.643 31.8636 196.603 31.8623L196.362 31.8524L196.125 31.8373C195.967 31.8256 195.811 31.8103 195.657 31.7915L195.428 31.7604L195.202 31.7239L194.979 31.6817C192.064 31.0883 190.009 29.0009 189.958 24.3473L189.958 24.0634L189.965 23.8263L189.975 23.6283L189.985 23.4874L190.005 23.2641L190.022 23.1077L190.043 22.9459L190.067 22.7791L190.095 22.6078L190.127 22.4323L190.163 22.2531L190.204 22.0707C190.211 22.0401 190.218 22.0093 190.226 21.9785L190.274 21.792C190.282 21.7608 190.291 21.7294 190.3 21.698L190.356 21.5085C190.385 21.4134 190.416 21.3177 190.45 21.2217L190.519 21.0293L190.595 20.8366C191.373 18.9408 193.067 17.0529 196.704 17.0529ZM84.6666 17.0529L84.8345 17.0545L85.0047 17.0594L85.177 17.068L85.3511 17.0802L85.5268 17.0963L85.7039 17.1165C85.7335 17.1203 85.7632 17.1241 85.7929 17.1282L85.9716 17.1549L86.1511 17.1861C86.181 17.1917 86.211 17.1975 86.241 17.2035L86.4212 17.2418C86.6616 17.2963 86.9026 17.364 87.1415 17.447L87.3203 17.5121C89.4009 18.306 91.2805 20.3043 91.2805 24.8045V25.4659H81.6242L81.6521 25.7363L81.6824 25.9804L81.7016 26.1098L81.724 26.2433L81.7503 26.3801L81.7808 26.5196L81.8162 26.661C81.8225 26.6847 81.829 26.7085 81.8358 26.7323L81.8792 26.8755C81.9101 26.9711 81.945 27.0669 81.9845 27.162L82.0474 27.304C82.4467 28.1515 83.2495 28.9049 84.9314 28.9049C85.9627 28.9049 87.021 28.3761 87.312 27.3706H91.1217C90.1432 30.7571 87.339 31.8679 84.9314 31.8679L84.6871 31.8654C84.6466 31.8646 84.6062 31.8636 84.5659 31.8623L84.3254 31.8524L84.0875 31.8373C83.9298 31.8256 83.7739 31.8103 83.6201 31.7915L83.3908 31.7604L83.1645 31.7239L82.9415 31.6817C79.9897 31.0808 77.92 28.9478 77.92 24.1694L77.9217 24.0072L77.9274 23.8263L77.9338 23.6961L77.9478 23.4874L77.968 23.2641L77.9853 23.1077L78.0058 22.9459L78.0299 22.7791L78.0579 22.6078L78.0898 22.4323L78.1261 22.2531C78.1325 22.223 78.1391 22.1927 78.1459 22.1623L78.189 21.9785C78.1965 21.9476 78.2043 21.9166 78.2123 21.8856L78.2628 21.698C78.2717 21.6666 78.2807 21.6351 78.29 21.6035L78.3485 21.4132C78.3587 21.3814 78.3691 21.3495 78.3798 21.3176L78.4467 21.1256C78.4584 21.0935 78.4703 21.0614 78.4824 21.0293L78.5584 20.8366C79.3361 18.9408 81.03 17.0529 84.6666 17.0529ZM183.608 17.0529L183.771 17.0547L183.939 17.0602L184.111 17.0696L184.286 17.0831L184.465 17.1008L184.647 17.1231L184.832 17.1501L185.019 17.182C185.05 17.1878 185.081 17.1937 185.113 17.1999L185.302 17.2395C185.777 17.3453 186.263 17.5016 186.733 17.7227L186.92 17.8146C188.375 18.562 189.631 19.9629 189.826 22.4493H186.069L186.046 22.3258L186.017 22.1973C186.012 22.1755 186.007 22.1536 186.001 22.1315L185.964 21.9975C185.951 21.9523 185.937 21.9068 185.922 21.861L185.873 21.7232C185.567 20.9174 184.917 20.0943 183.608 20.1743C181.754 20.1743 180.991 21.6518 180.757 23.1355L180.73 23.3249L180.708 23.5136L180.692 23.701C180.687 23.7632 180.684 23.8251 180.681 23.8865L180.674 24.0693C180.673 24.0995 180.673 24.1296 180.672 24.1595L180.674 24.6216L180.679 24.8652L180.689 25.1207L180.705 25.3855L180.72 25.566C180.725 25.6265 180.731 25.6874 180.738 25.7486L180.761 25.9327L180.789 26.1176C181.013 27.4737 181.659 28.8259 183.529 28.8259C185.408 28.8259 186.042 27.0268 186.042 26.3651H189.799L189.782 26.5189L189.767 26.6304L189.749 26.7485L189.714 26.937L189.686 27.0696L189.653 27.2073L189.616 27.3496C189.61 27.3736 189.603 27.3979 189.596 27.4223L189.553 27.5707L189.504 27.7227L189.451 27.8777C189.441 27.9038 189.432 27.9299 189.422 27.9562L189.36 28.1151L189.293 28.2759L189.22 28.4383C189.208 28.4655 189.195 28.4927 189.181 28.52L189.1 28.6839L189.011 28.8483C188.174 30.3562 186.523 31.8679 183.37 31.8679C179.953 31.8679 178.235 30.1795 177.447 28.1854L177.374 27.9915C177.291 27.7643 177.221 27.5338 177.16 27.3019L177.111 27.1029C177.103 27.0696 177.096 27.0364 177.088 27.0032L177.046 26.8037L177.009 26.6042L176.977 26.4051L176.949 26.2066C176.944 26.1735 176.94 26.1406 176.936 26.1076L176.914 25.9105C176.911 25.8777 176.908 25.8451 176.905 25.8124L176.889 25.6173L176.877 25.424L176.869 25.2326L176.864 25.0435L176.862 24.857C176.862 20.3073 178.846 17.0529 183.608 17.0529ZM129.667 17.0529L129.835 17.0545L130.005 17.0594L130.177 17.068L130.351 17.0802L130.527 17.0963L130.793 17.1282L130.972 17.1549L131.151 17.1861C131.211 17.1973 131.271 17.2093 131.331 17.2221L131.512 17.2629C131.752 17.3207 131.993 17.392 132.231 17.4789L132.41 17.5469L132.587 17.621C134.559 18.4819 136.281 20.4971 136.281 24.8045V25.4659H126.624L126.659 25.7953L126.683 25.9804L126.702 26.1098L126.724 26.2433L126.751 26.3801L126.781 26.5196L126.816 26.661L126.857 26.8038L126.879 26.8755L126.929 27.0189L126.985 27.162C127.36 28.0654 128.156 28.9049 129.931 28.9049C130.963 28.9049 132.021 28.3761 132.312 27.3706H136.122C135.143 30.7571 132.339 31.8679 129.931 31.8679L129.687 31.8654C129.646 31.8646 129.606 31.8636 129.566 31.8623L129.325 31.8524L129.087 31.8373C128.93 31.8256 128.774 31.8103 128.62 31.7915L128.391 31.7604L128.164 31.7239L127.941 31.6817C125.027 31.0883 122.972 29.0009 122.921 24.3473L122.92 24.1175L122.923 23.9489L122.934 23.6961L122.948 23.4874L122.961 23.3401L122.976 23.1866L122.995 23.0275L123.018 22.8631L123.058 22.6078L123.09 22.4323L123.126 22.2531L123.167 22.0707L123.212 21.8856L123.263 21.698L123.319 21.5085L123.349 21.4132L123.413 21.2217L123.482 21.0293L123.558 20.8366L123.638 20.6502C123.665 20.5881 123.694 20.5261 123.723 20.4642L123.815 20.2792L123.914 20.0953C124.814 18.478 126.507 17.0529 129.667 17.0529ZM63.4506 12.5022V15.8622H57.7091V31.4978H53.7406V15.8622H48V12.5022H63.4506ZM175.989 17.4235V31.4977H172.286V17.4235H175.989ZM67.8939 12.5022V19.2488H67.9471C68.423 18.0845 70.011 17.0527 72.0216 17.0527C74.773 17.0527 76.9155 18.6668 76.9155 21.762V31.4978H73.2117L73.211 22.7841L73.2052 22.5447L73.1989 22.4201C73.1976 22.3991 73.1962 22.378 73.1947 22.3568L73.1837 22.2289L73.1688 22.0995L73.1494 21.9692C73.0005 21.078 72.4976 20.1745 70.8041 20.1745C69.1642 20.1745 67.8939 21.2856 67.8939 23.4289V31.4978H64.1905V12.5022H67.8939ZM96.1482 12.5021V28.0582H105.593V31.4976H92.1797V12.5021H96.1482ZM110.011 17.4235V31.4977H106.307V17.4235H110.011ZM169.402 12.2636L170.008 12.2669L170.565 12.278L171.028 12.2976L171.307 12.3173V15.3069H170.276C169.322 15.3069 169.069 15.5302 169.003 16.1338L168.992 16.2596C168.99 16.2815 168.989 16.3037 168.988 16.3264L168.983 16.468L168.98 16.6204L168.979 16.7839L168.979 17.4231H171.387V20.0689H168.979V31.4978H165.275V20.0689H160.963V31.4978H157.26V20.0689H155.222V17.4231H157.26V16.2854C157.26 13.4225 158.796 12.3 161.265 12.2645L161.646 12.2642L161.993 12.2669L162.55 12.278L163.013 12.2976L163.292 12.3173V15.3069H162.259C161.306 15.3069 161.054 15.5302 160.987 16.1338L160.976 16.2596C160.975 16.2815 160.973 16.3037 160.972 16.3264L160.967 16.468L160.964 16.6204L160.963 16.7839L160.963 17.4231H165.275V16.2854C165.275 13.3756 166.863 12.2636 169.402 12.2636ZM114.455 17.4231L117.365 27.794H117.418L120.408 17.4231H124.35L119.27 31.4978H115.381L110.328 17.4231H114.455ZM146.134 15.3612L145.99 15.3592L145.846 15.3612C145.821 15.3619 145.797 15.3627 145.773 15.3637L145.625 15.3719L145.476 15.3845L145.325 15.4016C145.274 15.4081 145.223 15.4153 145.172 15.4234L145.018 15.4501L144.864 15.4819L144.708 15.5189C144.682 15.5255 144.656 15.5323 144.63 15.5394L144.474 15.5846C144.371 15.6166 144.267 15.6523 144.163 15.6922L144.008 15.7549L143.853 15.8239C143.828 15.8359 143.802 15.8482 143.776 15.8607L143.624 15.9393L143.472 16.0246C142.041 16.8665 140.831 18.6321 140.831 21.9998C140.831 25.7814 142.356 27.5427 144.008 28.2448L144.163 28.3075C144.215 28.3274 144.267 28.3463 144.319 28.3642L144.474 28.4151C144.5 28.4231 144.526 28.4308 144.552 28.4384L144.708 28.4808L144.864 28.5178L145.018 28.5495C145.044 28.5544 145.07 28.559 145.095 28.5635L145.248 28.5877C145.274 28.5913 145.299 28.5948 145.325 28.598L145.476 28.6151L145.625 28.6276L145.773 28.6358C145.797 28.6369 145.821 28.6377 145.846 28.6384L145.99 28.6404L146.134 28.6384C146.158 28.6377 146.182 28.6369 146.207 28.6358L146.354 28.6276L146.504 28.6151L146.655 28.598L146.807 28.5762C146.859 28.5681 146.91 28.5592 146.961 28.5495L147.116 28.5178L147.271 28.4808L147.427 28.4384C147.453 28.4308 147.479 28.4231 147.505 28.4151L147.661 28.3642C147.713 28.3463 147.765 28.3274 147.817 28.3075L147.972 28.2448C149.624 27.5427 151.149 25.7814 151.149 21.9998C151.149 18.6321 149.939 16.8665 148.507 16.0246L148.356 15.9393L148.203 15.8607C148.177 15.8482 148.152 15.8359 148.126 15.8239L147.972 15.7549L147.817 15.6922C147.713 15.6523 147.609 15.6166 147.505 15.5846L147.349 15.5394L147.194 15.4997C147.168 15.4935 147.142 15.4876 147.116 15.4819L146.961 15.4501L146.807 15.4234C146.782 15.4194 146.756 15.4155 146.731 15.4119L146.579 15.3925C146.554 15.3896 146.529 15.387 146.504 15.3845L146.354 15.3719L146.207 15.3637C146.182 15.3627 146.158 15.3619 146.134 15.3612ZM196.651 20.0953C194.905 20.0953 193.979 21.2064 193.767 23.0583H199.508C199.297 20.7832 197.841 20.0953 196.651 20.0953ZM84.6134 20.0953C82.8679 20.0953 81.9414 21.2064 81.7298 23.0583H87.4708C87.2592 20.7832 85.8039 20.0953 84.6134 20.0953ZM129.614 20.0953C127.868 20.0953 126.942 21.2064 126.73 23.0583H132.471C132.259 20.7832 130.804 20.0953 129.614 20.0953ZM207.431 13.6262V14.0032H206.787V15.7566H206.342V14.0032H205.699V13.6262H207.431ZM208.324 13.6262L208.71 15.3056H208.716L209.095 13.6262H209.739V15.7566H209.324V13.9766H209.318L208.92 15.7566H208.484L208.096 13.9766H208.09V15.7566H207.674V13.6262H208.324ZM110.011 12.3172V15.7562H106.307V12.3172H110.011ZM175.989 12.3172V15.7562H172.286V12.3172H175.989Z"
                        fill="#0F0F10"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M21.9999 3.66666C23.3506 3.66666 24.6674 3.81239 25.9345 4.08951C27.613 4.46697 28.8691 5.9572 28.8691 7.7494C28.8691 8.65195 28.5447 9.47567 28.0134 10.124C26.4496 11.8465 25.2212 13.8804 24.4323 16.1194C23.783 17.9589 23.4299 19.9384 23.4299 21.9996C23.4299 24.0617 23.783 26.0412 24.4323 27.8812C25.2212 30.1206 26.4496 32.1541 28.0134 33.8765C28.5447 34.5249 28.8691 35.3477 28.8691 36.2516C28.8691 38.0429 27.613 39.5336 25.9345 39.9106C24.6674 40.1877 23.3506 40.3334 21.9999 40.3334C11.8745 40.3334 3.66699 32.1249 3.66699 21.9996C3.66699 11.8747 11.8745 3.66666 21.9999 3.66666ZM29.9369 5.62424C31.1233 5.81058 32.3522 6.80534 33.0593 8.2951C33.8376 9.93584 33.7473 11.6836 32.9475 12.6965C30.8094 15.2011 29.5189 18.4496 29.5189 22.0001C29.5189 25.5506 30.8094 28.7996 32.9475 31.3037C33.7473 32.3171 33.8376 34.0644 33.0593 35.7051C32.3522 37.1953 31.1233 38.1901 29.9369 38.376C30.7344 37.6865 31.2389 36.6679 31.2389 35.5307C31.2389 34.599 30.9002 33.7462 30.3383 33.0892C27.6603 30.168 26.01 26.2754 26.01 22.0001C26.01 17.7248 27.6603 13.8322 30.3383 10.911C30.9002 10.2541 31.2389 9.40119 31.2389 8.46949C31.2389 7.33283 30.7344 6.31369 29.9369 5.62424ZM22.4308 6.5367C13.8908 6.5367 6.96756 13.4604 6.96756 21.9995C6.96756 30.54 13.8908 37.4628 22.4308 37.4628C22.8509 37.4628 23.2679 37.4463 23.6797 37.4137L23.9875 37.3863C24.7238 37.3199 25.3005 36.7012 25.3005 35.9477C25.3005 35.6003 25.1777 35.2807 24.9717 35.0313C24.7868 34.8282 24.6067 34.6213 24.4314 34.4102C23.7347 34.5301 23.019 34.5917 22.287 34.5917C15.3332 34.5917 9.6948 28.9547 9.6948 21.9995C9.6948 15.0452 15.3332 9.40727 22.287 9.40727C23.019 9.40727 23.7352 9.46987 24.4323 9.58884C24.6067 9.37909 24.7868 9.1722 24.9717 8.96914C25.1777 8.71925 25.3005 8.39961 25.3005 8.05178C25.3005 7.6748 25.1562 7.3327 24.9197 7.07565C24.6836 6.81764 24.3559 6.64707 23.9875 6.61458C23.4762 6.56298 22.9559 6.5367 22.4308 6.5367ZM35.383 9.69913C36.0854 10.1712 36.7213 10.9036 37.1585 11.8253C37.8747 13.3342 37.8628 14.9367 37.2397 15.9783C36.2216 17.6666 35.6365 19.6342 35.593 21.7386L35.5904 22.0085C35.5904 24.2083 36.1809 26.2661 37.2397 28.022C37.8628 29.0641 37.8747 30.6661 37.1585 32.1754C36.7213 33.0966 36.0854 33.8296 35.383 34.3016C35.6506 33.7846 35.8011 33.1984 35.8011 32.5768C35.8011 31.9418 35.6439 31.3436 35.3658 30.819C35.2816 30.6599 35.1823 30.5096 35.0747 30.3653L34.9645 30.2227C33.2207 28.0297 32.1543 25.2726 32.0964 22.2667L32.0939 21.9918C32.0939 18.9719 33.1118 16.1919 34.8167 13.9669L34.9645 13.7776C35.1145 13.5898 35.2535 13.3934 35.3658 13.1813C35.6439 12.6567 35.8011 12.0585 35.8011 11.4235C35.8011 10.8019 35.6506 10.2156 35.383 9.69913ZM22.5485 12.28C17.2579 12.3712 12.9965 16.6881 12.9965 21.9997C12.9965 27.3118 17.2579 31.6291 22.5485 31.7199C21.9914 30.7619 21.5141 29.7509 21.1271 28.6974C18.0391 28.0333 15.7242 25.2869 15.7242 21.9997C15.7242 18.7134 18.0391 15.968 21.1271 15.3034C21.5141 14.2494 21.9914 13.2389 22.5485 12.28ZM39.4746 16.4365C40.0332 18.1909 40.3342 20.0605 40.3342 21.9999C40.3342 23.9397 40.0332 25.8093 39.4746 27.5638C39.4312 27.1797 39.3251 26.8151 39.1693 26.4783C38.5257 25.1208 38.1655 23.6024 38.1655 21.9999C38.1655 20.3974 38.5257 18.8794 39.1693 17.5216C39.3251 17.1842 39.4312 16.8202 39.4746 16.4365ZM20.1332 19.2455C19.447 19.9608 19.0256 20.9312 19.0256 21.9995C19.0256 23.0175 19.4079 23.9461 20.037 24.6501L20.1332 24.754C20.0046 23.8515 19.9387 22.9336 19.9387 21.9995C19.9387 21.1997 19.9871 20.4108 20.0819 19.636L20.1332 19.2455Z"
                        fill="#FF884E"
                    />
                </SvgIconWrapper>
            );
        },
    ),
);

export { LiveOfficeLogo };
