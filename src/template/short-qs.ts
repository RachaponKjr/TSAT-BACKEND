import { IDataService } from '../controllers/pdf.controller';

const CATEGORY_ICONS: Record<number, string> = {
  1: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAADRklEQVRYCe2WTVLbQBCFLWNYsNINMpwg5gSYE8Q+gaUFP8UG5wSYE2BW/C0wJwBOEOcEMSdAN4iyoyjA+Z4y4xqbyBaCrOKuGre6p1/Pm+6RPJXKQhYVWFTg31Yg+Kj0u7u75uXlpU2+5mg0MkEQhOgUnTCGPN+en5/fzFsv2NraiqrV6sa8QDs/PDs7O56O3dnZ2YdMVySm56bsBLvPelenp6d6fiXB9vb26JV3hoNka34y8AeEdz1IyvMActKGytTR00QTfMdUrIeeEFWoB3h/wptjEJdQoTU3bdt0b+10aWkpPjk5uXHzTrNGHWyT0YagcX5sEY/9Db7rDNGqSxaItACV2yTxQM+zhIp2mFdVXdUSi02EK03Irw677FO5WAmLiMVeE1u38WNSNR1InM0iiajGkL5/Vezz83MDIhkMfVUE72Jsi9apVh9fm6GzdoneLH2o/XZBsnSlyfMNMg3IVNBxDX3IEMu5QiUS7wAaAfANpMsK+BgiP8CHPB+V3hnlvieJIckt56dQy/NIk6vL3IHmq/opKcbifpbEj2G8ZX1n1GB3hFFoh1RDX+qWA1v9a8p+s6ljAI8UYKgz1CmagV4bvbLeOdJBVKKPkDGhQ3a+USQji3/3yQgD9lMR7KyYKIpC5o1iaryyXT2UkASMKYF7BVleXm46p1pWURucY5aeqk7WKqpWn4UpMkeVszeM2FRf6kuuDlERIAcvWV1dXe/1eiJzxxAZwygt5BQZowQQu6qyw6aMgmIeHh5CGzu0Otzb2xOxN4sl0xUQMgmjp5bFPHyRc55A/s61jW/HkMpmkKenJ23KEZyXJpv3ychBrtbFxUUSFELnBHn/QykE1x3ZnPDMrbsRsUdsruHisHUn6ssOOp1OSBuKltz/L6uwS1XmWomQ8RXijzn5y4vTgESbEXkz2kgLMgPn07/9PYZxjjnaP9RZKHgRErFMaH+fq8kdOmXxkFvkZ3SDSZMF2B/mB4yJ26KmdIZCG1NEmemgx8fHeGVlRe6MlCrArrMwFtSXfAJiiRz6VfEDAnt7i3xn3jMLDfISkSdi8QOG+Qteb9At4yYP7zDvOtQuia/tR9bIR+t08U8hkcheyKIC/2UFfgOuNHRLxoarYgAAAABJRU5ErkJggg==" alt="" width="18" height="18" />',
  2: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAfCAYAAACPvW/2AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAHwAAAAD8/2prAAAEkUlEQVRYCb2Xy04bSRSGsQEJWHmeYMwLIHMRZIOmvZtdmN3scBZcN5gnoP0E2BvEZYH9BGM/QTo7JC7jPEGc3Sw9EoKYa76/U+W0i27bk6A5UrlOnVv9fc7pqnZqZAja3Nz0np+fVxke5tl0Op1/fHxsw+dOTk6qzF2SLfr2w8NDFuFfjFYqlQoYpcPDwxbrvpTqq0W5vr6+x+RH7cbGxmYBtAPAAhtVJycnd6W/ubk5ZVqRbHR0tAKov6N+8P7x8XHJkfUs0z2r+EUIWpsoM4zpg4ODJmA+y1ygbm9vTxn7LFcYbWQfZSNb+SCrMURhrG9s/G+iAanPPj097RCwgmuWdAduiLW1tRxA3yPPGJ3A5Clj07VVKScmJppkcWdqaqpSLpdV8heUmCHAFLAuskE5DowimY0F2FIlDoyUiqFMwvqAKloHd04ExJP/JmPmuusUXdMTvinNNE9ejupcnodsSEbMnKuz6zHLuDNOJQKo9oGrc9fYfZKMMiS2gPT39/f18fFxsW39xFHfAHEOkpn+ygFER0AG0Z6x1UO0kbV4E1tqbCMfehoKULFYzFxfXxd4ld+yoRpZIAYS/SdwAT4NfIOfPof0ZhB0j+E5uyvlLYApA/+i35GedQX+VwFmziHqAY68yqglvSRhDP24FAeEQAGbNBiB+yZxeD4rBg3ek3FzLHj4vsXPs/soFuNdXMZ6Aqg0vJLqh6JxbjNX6If6j/SDBaDZ9J0Pu6q1CFDKWM+V0gVknkZ3T9YYV7gS/KQDTDaWNjY23os/OjrKW1nSHAOsRZ/lbbbCc2hra0uoFTQL4tCA4EULZnt7W/2QSCpHtCSJhii0MaUtAGJaeyHSjfCJsodVSevy5KJU6jIoa2RlNtp06H1dktYBm1chAet0OrMEq5mA+8KiDPkSACgQcpsVyUQ6U0KGs0bpNvyrTNVqta09tbcJ6AtQSQulXAiNojvxJMpegECv8mlX8UqM9oyUu5QGoU/sEBSzHwcKQO/Q6Sb3aP4CfA+pKTV6hEMszF6+MS0JS9jUg0Cp3jiFoAG3r+PBBAknmtLTiMoG8XFg5BMCEjMIFPoyZk2GPavkZkmlflFuq3TnJDCy6wLSYhAoyrIrO6io0zzk/uNPPzAKNerGu7y8DObn51PIPQ34EWQfZHdxcdGam5v7hbK9UT8tLy/Xzs7OviD7jLpxdXWlDCbSIDByfAFIwn6gZmZmzrhK/sQsy/dNZ2lpqQ3AL2Svvbi4mDk/P/9HMVwaBox8lIlEIoiP0vaGT0lLMuaq0D8O9dQLQq5Pjjogu3fUsGAUrC8gGbigEGUYReki1ASAjoUcMuktlQ1j7cNX2yrj5oGA5OSACuMAoAqAFRYCsGvewhFzSQvAamj4/WcgGJnG9tD3GN+4aE8BRJfvH1y+FRq+g8XvGgsLCx799BF5E/s6jd7ATjoBHgoMdr2vvQRJpCOBDfLRy/fu7q5q7cmWxyWsz5eQ9BEH+PAEN8eJVfWdhypZUgR9lrh/l9n8p2L2HIxJGyfJ9RVJFgKrh4/+abTi/3+m6Vd+9OR20X4FyOZXou8z+AwAAAAASUVORK5CYII=" alt="" width="18" height="18" />',
  3: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAADK0lEQVRYCe2XvU4bQRDHfWcXFhThDUKeII4QKOX5CeI8AaYATIXp0mF3dNgNMlCAu3SQJ8D0oDhvcHmDowEKPvL7H7enY7O2IXYUKfJIy87O/OfjZueOcS43pWkFphX4uxXwxnVfq9XmHx4eTvAz5/t+udPphOP49Mcxlu39/X3AVmIpsQr7WDR2Qlb0Oev86mPh1RZDDB4fHzfX1taWLUhUKBRW9vb2+pbceZxoQp7nqUK/VYlr3US+4szAEk46oRD/WilRtYhEm6lgBDPRhAjePTg4aIyIOVQ96aYeGuwlyklXaNrUo6oeAdBKiYYO/1lTk0V72tTpXTiY6ZfaURRb9P81daFer8/d3t6WGKx69uPa5z/B4iMcNbQZv8L619fX3xmsztbX18/sBOyzC8s35q3BZXmwR/KbTJMG4txvbm52E+yZj5MYxBsSMMtsuyz0BCR8hG5eerDxiJHIGpKJkFfxoXE2h98YA1sSTj4ktwn8ruwkVy4eM3Gg7DLAkHOboarPLifvMahnAkTMzh80uiJTki5qYnOKXn5NIqlfGdzd3ZXwswxb0lmUz+c/x+UhqSrBBzl/Qj/9jQhUPjw87PPUJ/CVrNLwJPJtf3+/srq6qqDCzRvdgF0PuUWvHcfjR8z4/jvA3QEGKuexKqNkhCHI1SAs8jfSCYtdGXaY3578KgfZePqTpeRnjcqoFbHCmZmZXqvVEp+S46pTHQFWTAAjVA/R6AFn+dUDhbOzs6e2X09Nhb7OavCPsSnwILKxnBtgt7N4KtLmuuroJJe+hd+tLMbms9j8wsLCVwBFVrC0tBReXFz8sA10Toy+JLoAuysC7SwuLnaT6zunMk2S6dBfGup3EuxHsLnLy8vz5Pxs29jYWMa+ZbCqkKqjKsWkXqHb2+ZnS3I1ClBJIOnmwuJcAaopKGGEZXW5yp5Eid9PsIpvqBn3EEk1kDwrvUHYO057BAxsuev8Giz2Tc1S8VsWMzQiDkKXY8mk40rKXElZTTsMCzzSN+WlWPBbyoHd+ZZVqUAJnT6I+k31k3VqSi0jQ1S2gi7g/AxbLBb79tvjwvLt69tv2i8JE7qmOnR/ugAAAABJRU5ErkJggg==" alt="" width="18" height="18" />',
  4: '<img src="data:image/png;base64,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" alt="" width="18" height="18" />',
  5: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAAEGUlEQVRYCe2Xu1YaURSGESzUxvEJMr6Aa1xeKtcSy1QxTwAUXhuHLh1QpRQaRS0CXbrgEwC9rswjTJsqY6MUXvL9ZA4ZFRUETIrstTbnOmd/s/c+Zw6x2D8mY2/Js729nby9vV0dGxuzsRtQnpbL5Qb1jrwZ0ObmZg6reTRAfdRGLaAak5OTH4vFovpjcf2MWgwMxktTU1Ozx8fH8+hMPB7P3N3dOVdXV98Mw8g9FIGpHB0dZba2tvYwnkQDPJNttVoOYawDt6bwjdRDBkZvn0gkShsbG2k8UkRtNH15eemGOeTTXte8kQEZGMLkydDBwYFH3VZdIaNeQ1fVpvQpplUfCZCBYf0CxrIypB1GWBqq46mf8gjaVJvSobhQfehAURg8kSdH5KEAozmFZ3x8XN4pKaE1Hs7XbqsJKKGfYclDGK3reV5raWnpB0Du4uKiA0gTsK8rKyv+3NzcZ6Z8EiAJX9b8oe2ybjAyYISQKaFzqG36wrKKp9KmbyhABoY3bfCma2bxbiVz15m3B1iS8Xswmj9wDkVhZCRsa+2uwvaffgpGDwyUQ3pb1ijzxqd45v3CwoI8nqeMnZ+fN2UgKjs7O6mbm5sKfY88Y+a9Goit65ycnDQwLqjk8vKyD1TpKaheYAT1KqAwD+oYdwSDhzyO/+2HUOyu5tnZmd8rjID6ziHXdS12hc4MD1WCKlzz1KsKh4zrfDHfpn5gWKO/bY9nXJ7JAVEjMdPyDKVDoqYPDw+rjFcYT5l2vzA82zuQPMOpaxGa7zxnoUU8kX0IQVvjDrAVQVN/MoEZeyQ9nUOhZ3RtUKjkpUAr8RlY00fTQNGlcYVRX2+bel8wzO8th8gHGbJQFy3S1vcouL6+ru/u7jrhSesxto42yalZ5mTCfrp6l149FL1+BkpYmcALddQCzuRU2zMaD+85vZOEM1/cZYTDwBRCz8R0w9PzgBiwNM2a8cxrYdpr6qebKIm50Slv8mhBW5lS9xo79IyaNVRhDNQQMDC+6q+VRyHTNZM3F4gTLipjRS7nJfPPQFCR3VYDJMsZ5HJyC24guRcyhQeYL6guVPpHkGH1UzSPt+rymqwBk6JQXbDOxMREMAwY1vqzy+QZ2nm0QC6scbg1UF87BTCdxLYu5ZGcqipEjJ0azzFnYOmEjL8n31jNUWJGjCpx23cc+vKMK8ElfZ8vvx97+bcTMt7UYbrCI3HRGpqlP6mzhrqHSkYGo8U7QGpEBc9YtN+pj5xRvS2EKR9WR1JEgZp4I6XE1a7Bmo26aEHnCoAfUH/Qbc16z0oHCIgKMy3+Z+9jVH97Z9nqMzp/9PcXWCV39dnVhjDYSWqtReLKI/uojzf0ObigXKVM0jfS3GH9ttwDUk946AkqqTZAHlqV19T+L3/bA78AOsBD59GWdQEAAAAASUVORK5CYII=" alt="" width="18" height="18" />',
  6: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAZCAYAAABQDyyRAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAGQAAAAAAt7gEAAABu0lEQVRIDe1WwXGDMBAEhgf2yyWQCkI6iDtIOiAPPB4+cQdxCeTjsc0jlJBUkJRACZTAy+OPTVZEwocknEwcwSea0ei0Ot0tp9MJ2yItiqLQtu0XAlGxGI/HN0mSlBSU5dls9gRsKeN8rthwqCKc+3Quyf5+v59ImDKFjUABT4Cy3z6tfUnz+fxWxtj8cDiUaZrmujWKhWE48Tyvi0SxXq8Lqj+4bPNz94dggpxK3DNJZ5zTbrezXOEFRDIh9zAGVVXVedIQ2Gw2Dz04rl3gqi4h1ARa17AvAtTP4ASaI6Cs/krmVfEO2T7tqqCmIxDiYwJU0K7CZJkm8G0wW0eAMuwfj0fGWmm4NgVKcaYsSIDuMYLNd+BMs36M2P0XrUUA9X6BevAoFukI3IrjOF+tVjnFNbLyvggdZkNu8hFkUPrQdWx8/YFza7vdLh3HuWIdewru8J7NR6OR8py3IsBfuynf9OtBvHg87BaclwKTjcoRkNcvmiNv3hDNAkZY17ZWBLQaF4CI6ALbWe9sRiPQ6ZUs/BNocoD9GZHImBavhYOGALK163dc6BoZXVyVZ9zThpERLxqj8FvCb/YJ411+jz6k1VsAAAAASUVORK5CYII=" alt="" width="18" height="18" />',
  7: '<img src="data:image/png;base64,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" alt="" width="18" height="18" />',
  8: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAADTUlEQVRYCc1XTW7aQBjlT4iwqW9Qd9clCbAnN6C77upIhACr5ASBE0BWELLAPUHVE4QDACUnqLvrru4mihA/fc81xDIzngGrUkcajfnmfd+8+f5sEon/bCR1+DQaDXOz2dwqsPP7+/s7BUa5nVEiAFiv11+wFFTYer2eHA6HPRUual+LEAwYmE4qlToXGVutVpVkMjnycSKItkyXkGdwMBg4IssIqQMvirYOlqUO1vjHClpJjdz4BR4MW+RA2MaYFzJPRir7m2kV6PLy0sIhH4FzMX/6K5/DE6LEe1Rj9ezs7PdsNptTcOhQegje+Q6jJhL6nermwLaB9doDLmFjdlQ6YcKRhJCsFSTrIwyP0WOEFRY26PesR3jKxJ6DtfPw8GCHcbLfkSErFossZXrnYjKZODIjQTlw7nQ6vYMuL1vFZaqlUsksl8tP3AtiRc9SDx3jnfABIW+RTEfVOKWErq6u6PYKmyHyYBw8rFarXUNuBGXBZ+zZwdxBbl1jn7lFnZsoUkJClmUZ2WyWpT6H8inW3eCtkVdM9KhBT7SDAF/vG2QGCEsLRNgYc7mcd3vE/0fQKJ95c3otaubz+Z5ID7IO5biQxVU0VK8OemlvhEO4B5AIFouFDc93cdGCBJJQEdrTa7VaBdzQ8+De5r7ACeaSbdsu8omoN/vQv5KDCCHRR8vl0pIZE8mbzabV7/c/i/ZEMm1C9AzJwN1sdroH3MKbH3CwLl4/ZIEwjcMVJLopZQgPS10aHpGesMpEwCgZQ4nQfIrC6O7FJgQvdBFCC1+NNru77sEyXCxC/DSB4WtMlwcgrCOucUYsQmiOXpgymcw5SDBxzbheikUIofL6EZodK29MzyB0Jtdjh3bZSw74Cnnh+fnZe0cRk06nHa7Hjlgewqugh4O9UKE/kcPNsa+V7QVieYivAhiy/Lm1GWvVJoQEdlFFPMzgp4TOqT5eB7rDaBNCnjhIXhfJW+XcWVA/OGrIK0KbEMMDz5zi1m3ky9tXE+InkGY4n05OTphn2kObEC36nxKWtvUjgLGq7IjzlCpCD728vLjbfMGL01Ra0QQgjIYPdWQqXvMQbfr/FLqivTgyfk9h8p+MI7IjJbQF65b4Fq9aZUS2en8AOOpRgQi+7XwAAAAASUVORK5CYII=" alt="" width="18" height="18" />',
  9: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAJAAAAAAqDuP8AAAEGElEQVRYCc2XS1LbQBCGbRDvRZQTxLkBOQH2CXBOELPgscM+gc0JEBuKxwLnBsoJcE6AbxDdAGXBo6CAfL+YUY2EUAwYF1M17uf09HT3tMbVyghja2ur9vDw0K1WqzsHBwdRfkm73favrq666Pw+OjoK83LRm5ub24KHh4d7gs+NqecELv/+/r7HZi055fItfnl5WUfWht61PBeaAwXoBMJdWR4fyaH8ojzNRn6e91p6LA69dvOidV4R0/JUG9fX1z4R+MQU2y8KuSOvFMlZV9NijampqdJoVh/Vsr8m5ydsVM9KxkNxOUJmp+iCFEaIIlZxvoszOhIHbQIUqYZodzyJUKvV8mdnZ8+NUocQh+6Ct+IcVs4kt3FxcfFzEASxa/NJhObn530WJTpypiisroGX4pRDaDJQUX2yPuuQqZe0v6AspYkMUrdLw0wdUuP1cKDH7j8m4kFuE1NLGa5HWtSFkzstCagi1MxovROh24bpbIRMjazZPZVCojYph55c/SdFbR0TvLu789fX11suj1PF9gOqxnlxcdGEVyOy0fHxcV+6uqkzMzM61BDeUDzsLAOWyciQA4tVOEodmp6e1o07ya2MoENFko/qqZyBrgArGxsbXTZsiDbrdkATh5DLwS78RC6dolHqkLNgh6j0HFq1pptZY35XxBQBNj2D3wYGru5L8JEcYoMvRKQuw0Qg3t/fH7KxHBjwvgnFV2rQaZDmmMiK9arh2Tqwqwmpb3EL2bylKRrYB6wxl5nC08EFGYhQOgX/N7C1SmT/So/DxXTugUdR9iC2yxYj32MmaaCTx0Y3wqCcSgc11FQEYUQpswRhfYDdVINX554HYwBnhemnEue5YHhpn3La/U9kXZxo40SInRXS1VcESeMafDn2g2j1dVuFoxMBNe2ILCKInYFnrnBoBQo3aftjaUE2aWsaXgT8enNzE8zNza3A30U/+VjqcAsLCx3pYbwD/0S24IultCjV6UCnkf9Wlha1KdBGagFEPNH9fl+wwQHq8GoUcmRrSHLwPrIBDi3jtL+0tBTqy64DS/7cKHWITWIMD59bLL7rRF4PWQRPc+Tx4d7UH86hJGW5vNZGju/bFWvsnVpRij1dW3tLUsmEEPY9dbfCl86HS1nSINyUqYnRL86M52N/5NMCVpmB7Hue940oJW1EtFL22LFEOYN37imL6g5r7CiHDuno3/OGC1OmjqoFeeVx0dgeMJOOnrdZGCGr5PyV3iViTYz8Yrat3ELC3gTX5yPS58DyHajPUVLASpOeL44sg5Z2avMnLqb6kycCK89N980Y4QkR42jCK5K7V9utmYwRQxSmrEhxUrxxOxS/1fHSlFnj1EWPGnogLTuW58Lb29uQp4j+UQxcvsWVRjU90UUptXqC/wChOgYmPcpoLAAAAABJRU5ErkJggg==" alt="" width="18" height="18" />'
};

function getItemResult(
  criteria: IDataService['categories'][0]['items'][0]['criteria']
): string | null {
  if (criteria.some((c) => c.result === 'FAIL')) return 'FAIL';
  if (criteria.every((c) => c.result === 'OK')) return 'OK';
  return null;
}

function circleOK(active: boolean): string {
  return `<span class="circle ${active ? 'c-ok' : 'c-empty'}"></span>`;
}

function circleFAIL(active: boolean): string {
  return `<span class="circle ${active ? 'c-fail' : 'c-empty'}"></span>`;
}

function renderCategories(cats: IDataService['categories']): string {
  return cats
    .map((cat) => {
      const icon = CATEGORY_ICONS[cat.id] ?? '&#128269;';

      const items = cat.items
        .map((item, index) => {
          const res = getItemResult(item.criteria);

          // 💡 เช็คว่าถ้าเป็นตัวสุดท้ายของหมวดหมู่ ไม่ต้องใส่ border-b
          const isLast = index === cat.items.length - 1;
          const borderClass = isLast ? '' : 'border-b border-gray-400';

          return `
          <div class="item-row ${borderClass} pl-2 flex items-center justify-between">
            <span class="item-name text-gray-700 style-text-item">${
              item.name
            }</span>
            <div class="circles flex flex-row gap-2 px-4 py-1" style="border-left: 1px solid #9ca3af;">
              ${circleOK(res === 'OK')}
              ${circleFAIL(res === 'FAIL')}
            </div>
          </div>`;
        })
        .join('');

      return `
      <div class="cat-block mb-3">
        <div class="cat-header flex items-center gap-1.5 mb-1">
          <span class="text-xs font-bold text-gray-800">${cat.name}</span>
        </div>
        
        <div class="flex flex-row gap-4 items-start w-full">
          <div class="cat-icon text-base p-1 text-gray-600">${icon}</div>
          <div class="flex flex-col flex-1 border border-gray-400 rounded overflow-hidden">
            ${items}
          </div>
        </div>
      </div>`;
    })
    .join('');
}

export function generatePDFQSShort(data: IDataService): string {
  const categories = data.categories;

  // summary counts
  let totalItems = 0;
  let okCount = 0;
  let failCount = 0;
  categories.forEach((cat) => {
    cat.items.forEach((item) => {
      totalItems++;
      const res = getItemResult(item.criteria);
      if (res === 'OK') okCount++;
      else if (res === 'FAIL') failCount++;
    });
  });
  const okPct = totalItems > 0 ? Math.round((okCount / totalItems) * 100) : 0;

  // split categories into 2 columns
  const half = Math.ceil(categories.length / 2);
  const col1 = categories.slice(0, half);
  const col2 = categories.slice(half);

  // format date
  const checkupDate = new Date(data.checkup_date);
  const dateStr = checkupDate.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const kmFormatted = Number(data.car_mileage).toLocaleString();

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>ใบตรวจสภาพรถยนต์ (ฉบับย่อ)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600;700&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@100..700&family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap');

    @page {
      size: A4 landscape;
      margin: 10mm;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: "IBM Plex Sans Thai", sans-serif;
      font-size: 11px;
      color: #222;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    *, input, button, select, textarea, p, span,td {
      font-family: 'IBM Plex Sans Thai', sans-serif !important;
    }

    .page {
      width: 100%;
      padding: 14px 18px;
    }

    /* ── Header ── */
     .header {
      background-color: #F5F5F5;
      padding: 10px 15px;
       margin: 0 0 16px 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #CCCCCC;
    }

    .header img {
      width: 180px;
      height: auto;
      display: block;
    }
    
    .head-info{
    display:flex;
    gap:8px
    }
    

    .logo-wrap { display: flex; align-items: center; gap: 8px; }
    .logo-box {
      width: 52px; height: 36px;
      border: 2px solid #c00; border-radius: 3px;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; font-weight: 700; color: #c00; letter-spacing: 0.3px;
    }
    .brand { font-size: 12px; font-weight: 700; color: #c00; line-height: 1.3; }
    .brand-sub { font-size: 8.5px; color: #555; }
    .co-info { text-align: right; font-size: 8.5px; color: #333; line-height: 1.6; }
    .co-info b { font-size: 9px; font-weight: 700; }

    /* ── Doc title ── */
    .doc-title { font-size: 13px; font-weight: 700; margin-bottom: 8px;white-space: nowrap; }

    /* ── Meta grid ── */
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 0 12px;
      width: 100%;
      margin-bottom: 10px;
    }
 
    .meta-item {
      display: flex; align-items: baseline; gap: 4px;
       padding-bottom: 1px; margin-bottom: 5px;
    }
    .meta-label { font-size: 8.5px; color: #555; white-space: nowrap; }
    .meta-val { font-size: 10px; font-weight: 600; flex: 1;border-bottom: 1px dotted #555; }

    /* ── Body: summary + columns ── */
    .body-wrap {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 10px;
    }

    /* ── Summary box ── */
   .summary-box {
    min-width: 200px; /* แก้ไขตัวสะกดจาก min-wight และใส่เครื่องหมาย ; */
    height: max-content;
    padding: 10px 8px;
    }
    .summary-head {
    display: flex;
    flex-direction: row; 
    justify-content: space-between; 
    align-items: flex-end; /* แก้ไขจาก items:end เพื่อจัดให้ไอเทมชิดขอบล่าง */
    gap: 4px; 
    }
    .sum-title { font-size: 9px; color: #555; margin-bottom: 4px; }
    .sum-total { font-size: 18px; font-weight: 700; line-height: 1; color: #555; }
    .sum-unit { font-size: 10px; color: #555; margin-bottom: 8px; }
    .progress-bar {
      height: 8px; background: #C21A20; border-radius: 4px;
      overflow: hidden; margin-bottom: 10px;
    }
    .progress-fill { height: 100%; border-radius: 4px; background: #1e8c3a; }
    .sum-row {
      display: flex; align-items: center; gap: 5px;
      margin-bottom: 5px; font-size: 9.5px;
    }
    .sum-pct { color: #aaa; font-size: 8px; }
    .sum-legend {
      margin-top: 10px; padding-top: 8px;
      border-top: 1px solid #ddd;
    }
    .legend-row {
      display: flex; align-items: center; gap: 5px;
      margin-bottom: 4px; font-size: 9px;
    }

    /* ── Circles ── */
    .circle {
      display: inline-flex; align-items: center; justify-content: center;
      width: 13px; height: 13px; border-radius: 50%;
      border: 1.5px solid; flex-shrink: 0;
    }
    .c-ok   { border-color: #1e8c3a; background: #1e8c3a; }
    .c-fail { border-color: #c00;    background: #c00; }
    .c-warn { border-color: #e5a000; background: #e5a000; }
    .c-empty{ border-color: #aaa;    background: transparent; }

    .bg-transparent{
     background: transparent;
    }

    /* ── 2-column category area ── */
    .columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-content: start;
    }

    /* ── Category block ── */
    .cat-block { margin-bottom: 6px; }
    .cat-header {
      display: flex; align-items: center; gap: 6px;
      padding: 4px 6px; margin-bottom: 2px;
      border-radius: 0 3px 3px 0;
    }
    .cat-icon { font-size: 13px; width: 18px; text-align: center; }
    .cat-name { font-size: 10px; font-weight: 700; color: #222; }

    /* ── Item row ── */
    .item-row {
      display: flex; align-items: center; gap: 4px;   
    }
    .item-name { flex: 1; font-size: 9.5px; color: #333; }
    .circles { display: flex; gap: 4px; }

    /* ── Footer ── */
    .footer {
      display: flex; justify-content: space-between;
      margin-top: 12px; padding-top: 8px;
      border-top: 1px solid #ccc;
    }
    .footer-note { flex: 1; }
    .footer-label { font-size: 9px; color: #555; margin-bottom: 14px; }
    .footer-box { border: 0.5px solid #ccc; height: 36px; border-radius: 3px; }
    .footer-line { border-bottom: 1px solid #555; width: 160px; margin-bottom: 3px; }
    .footer-name { font-size: 9px; color: #555; }

        /* ==========================================================================
    ชุดคลาส Flexbox สำเร็จรูปสำหรับแปลง PDF (เรียกใช้งานง่าย)
    ========================================================================== */

    /* 1. เปิดใช้งาน Flex */
    .flex         { display: flex; }
    .inline-flex  { display: inline-flex; }

    /* 2. ทิศทางการเรียง (Flex Direction) */
    .flex-row     { flex-direction: row; }         /* เรียงแนวนอน (ซ้ายไปขวา) */
    .flex-col     { flex-direction: column; }      /* เรียงแนวตั้ง (บนลงล่าง) */

    /* 3. การจัดแนวแกนหลัก (Justify Content) */
    .jc-start     { justify-content: flex-start; } /* ชิดซ้าย / ชิดบน */
    .jc-center    { justify-content: center; }    /* อยู่ตรงกลาง */
    .jc-end       { justify-content: flex-end; }   /* ชิดขวา / ชิดล่าง */
    .jc-between   { justify-content: space-between; } /* กระจายชิดขอบสองข้าง (ใช้บ่อยสุด) */
    .jc-around    { justify-content: space-around; }  /* กระจายแบบมีช่องว่างรอบๆ */

    /* 4. การจัดแนวแกนรอง (Align Items) */
    .ai-start     { align-items: flex-start; }     /* ชิดขอบบน / ชิดซ้าย */
    .ai-center    { align-items: center; }         /* กึ่งกลางแนวตั้ง (ใช้บ่อยสุด) */
    .ai-end       { align-items: flex-end; }       /* ชิดขอบล่าง / ชิดขวา */
    .ai-stretch   { align-items: stretch; }        /* ยืดให้เต็มความสูง */

    /* 5. การขึ้นบรรทัดใหม่เมื่อล้น (Flex Wrap) */
    .flex-wrap    { flex-wrap: wrap; }
    .flex-nowrap  { flex-wrap: nowrap; }

    /* 6. ระยะห่างระหว่างไอเทม (Gap Shortcuts) */
    .gap-1        { gap: 4px; }
    .gap-2        { gap: 8px; }
    .gap-3        { gap: 12px; }
    .gap-4        { gap: 16px; }

    /* 7. คลาสจัดตรงกลางเป๊ะๆ (Combo Class) */
    .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    }

    /* 1. คลาสควบคุมการยืดหดของไอเทมภายใน Flex (Flex Properties) */
    .flex-1 { flex: 1 1 0%; }    /* แบ่งพื้นที่เท่าๆ กัน (ยืดและหดได้ลึกสุดขอบ) */
    .flex-auto { flex: 1 1 auto; } /* ยืดหดอัตโนมัติอิงตามขนาดของเนื้อหาจริง */
    .flex-initial { flex: 0 1 auto; } /* หดได้อย่างเดียวเมื่อพื้นที่ล้น แต่ไม่ยอมยืดขยาย */
    .flex-none { flex: none; }    /* บังคับขนาดตายตัว ห้ามยืดและห้ามหดเด็ดขาด */

    /* 2. ความกว้างแบบเปอร์เซ็นต์ (Percentage Width) */
    .w-full   { width: 100%; }
    .w-1-2    { width: 50%; }
    .w-1-3    { width: 33.333333%; }
    .w-2-3    { width: 66.666667%; }
    .w-1-4    { width: 25%; }
    .w-3-4    { width: 75%; }

    /* 3. ความกว้างอ้างอิงตามเนื้อหา (Content Width) */
    .w-auto   { width: auto; }
    .w-max    { width: max-content; } /* กว้างเท่ากับเนื้อหาที่ยาวที่สุด (ห้ามตัดคำ) */
    .w-min    { width: min-content; } /* บีบกล่องให้แคบที่สุดเท่าที่คำในนั้นจะไม่ตัด */

    /* ==========================================================================
   ชุดคลาสสำหรับจัดการเส้นขอบ (Border Utilities)
   ========================================================================== */

    /* 1. ความหนาของเส้นขอบ (Border Width) */
    .border        { border: 1px solid; }
    .border-2      { border: 2px solid; }
    .border-b      { border-bottom: 1px solid; } /* เส้นขอบล่างอย่างเดียว (ฮิตมากสำหรับทำหัวข้อ) */
    .border-t      { border-top: 1px solid; }    /* เส้นขอบบนอย่างเดียว */
    .border-l      { border-left: 1px solid; }   /* เส้นขอบซ้ายอย่างเดียว */
    .border-r      { border-right: 1px solid; }  /* เส้นขอบขวาอย่างเดียว */
    .border-0      { border: 0 !important; }     /* เอาเส้นขอบออกทั้งหมด */

    /* 2. ลักษณะของเส้น (Border Style) */
    .border-solid  { border-style: solid; }  /* เส้นทึบ */
    .border-dashed { border-style: dashed; } /* เส้นประแบบขีดๆ */
    .border-dotted { border-style: dotted; } /* เส้นประแบบจุดๆ (ฮิตมากสำหรับทำเส้นกรอกข้อมูล) */

    /* 3. ความโค้งของมุมกล่อง (Border Radius) */
    .rounded-none  { border-radius: 0px; }
    .rounded-sm    { border-radius: 2px; }
    .rounded       { border-radius: 4px; }   /* โค้งมนกำลังดี (แบบเดียวกับกล่องสรุปเดิม) */
    .rounded-md    { border-radius: 6px; }
    .rounded-lg    { border-radius: 8px; }
    .rounded-full  { border-radius: 9999px; } /* มนจนเป็นวงกลม/แคปซูล (ใช้ทำพวก Badge หรือสถานะ) */

    /* 4. สีของเส้นขอบ (Border Color - อิงตาม Tailwind Palette ยอดนิยม) */
    .border-gray-200 { border-color: #e5e7eb; } /* เส้นสีเทาอ่อนมาก (เหมาะทำเส้นตัดแบ่งแถว) */
    .border-gray-300 { border-color: #d1d5db; } /* เส้นสีเทาอ่อน (เหมาะทำขอบตารางทั่วไป) */
    .border-gray-400 { border-color: #9ca3af; } /* เส้นสีเทากลาง */
    .border-gray-800 { border-color: #1f2937; } /* เส้นสีเทาเข้ม (เกือบดำ) */
    .border-red-500  { border-color: #ef4444; } /* เส้นสีแดง (สำหรับเคส FAIL หรือเตือน) */
    .border-green-500{ border-color: #10b981; } /* เส้นสีเขียว (สำหรับเคส OK) */

    /* ==========================================================================
   ชุดคลาสสำหรับจัดการระยะห่างภายใน (Padding Utilities)
   ========================================================================== */

    /* 1. Padding ทุกด้านเท่ากัน (Top, Right, Bottom, Left) */
    .p-0 { padding: 0px; }
    .p-1 { padding: 4px; }
    .p-2 { padding: 8px; }  /* นิยมใช้กับพื้นที่เล็กๆ เช่น ช่องในตาราง (Table Cell) */
    .p-3 { padding: 12px; } /* ขนาดมาตรฐานสำหรับกล่องข้อความทั่วไป */
    .p-4 { padding: 16px; } /* ขนาดกำลังดีสำหรับกล่องสรุปขนาดใหญ่ หรือขอบหน้ากระดาษ */
    .p-5 { padding: 20px; }
    .p-6 { padding: 24px; }

    /* 2. Padding แนวตั้งอย่างเดียว (บน-ล่าง) / Padding ยอดฮิตสไตล์ Tailwind */
    .py-0 { padding-top: 0px;   padding-bottom: 0px; }
    .py-1 { padding-top: 4px;   padding-bottom: 4px; }
    .py-2 { padding-top: 8px;   padding-bottom: 8px; }
    .py-3 { padding-top: 12px;  padding-bottom: 12px; }
    .py-4 { padding-top: 16px;  padding-bottom: 16px; }

    /* 3. Padding แนวนอนอย่างเดียว (ซ้าย-ขวา) */
    .px-0 { padding-left: 0px;   padding-right: 0px; }
    .px-1 { padding-left: 4px;   padding-right: 4px; }
    .px-2 { padding-left: 8px;   padding-right: 8px; }
    .px-3 { padding-left: 12px;  padding-right: 12px; }
    .px-4 { padding-left: 16px;  padding-right: 16px; }

    /* 4. Padding แยกเฉพาะด้าน (เจาะจงจุดที่ต้องการ) */
    .pt-1 { padding-top: 4px; }    .pb-1 { padding-bottom: 4px; }
    .pt-2 { padding-top: 8px; }    .pb-2 { padding-bottom: 8px; }
    .pt-3 { padding-top: 12px; }   .pb-3 { padding-bottom: 12px; }
    .pt-4 { padding-top: 16px; }   .pb-4 { padding-bottom: 16px; }

    .pl-1 { padding-left: 4px; }   .pr-1 { padding-right: 4px; }
    .pl-2 { padding-left: 8px; }   .pr-2 { padding-right: 8px; }
    .pl-3 { padding-left: 12px; }  .pr-3 { padding-right: 12px; }
    .pl-4 { padding-left: 16px; }  .pr-4 { padding-right: 16px; }

    /* ==========================================================================
   ชุดคลาสสำหรับจัดการความโค้งมนของมุมกล่อง (Border Radius Utilities)
   ========================================================================== */

    /* 1. มนแบบเท่ากันทุกมุม (รอบด้าน) */
    .rounded-none  { border-radius: 0px; }       /* สี่เหลี่ยมมุมฉากคมเป๊ะ */
    .rounded-sm    { border-radius: 2px; }       /* มนเล็กน้อย (เหมาะกับป้ายขนาดเล็ก/Badge) */
    .rounded       { border-radius: 4px; }       /* มนมาตรฐาน (เท่ากับกล่อง summary-box เดิมของคุณ) */
    .rounded-md    { border-radius: 6px; }       /* มนกำลังสวย (นิยมใช้กับรูปภาพ หรือกล่องเนื้อหาหลัก) */
    .rounded-lg    { border-radius: 8px; }       /* มนแฟชั่นสไตล์โมเดิร์น */
    .rounded-xl    { border-radius: 12px; }      /* มนมาก */
    .rounded-full  { border-radius: 9999px; }   /* มนจนเป็นวงกลมเป๊ะ หรือทรงแคปซูลยา (ฮิตมากสำหรับรูปโปรไฟล์) */

    /* 2. มนเฉพาะฝั่ง (มีประโยชน์มากเวลาทำแท็บ หรือหัวข้อการ์ด) */
    .rounded-t     { border-radius: 4px 4px 0px 0px; } /* มนเฉพาะ "สองมุมบน" */
    .rounded-b     { border-radius: 0px 0px 4px 4px; } /* มนเฉพาะ "สองมุมล่าง" */
    .rounded-l     { border-radius: 4px 0px 0px 4px; } /* มนเฉพาะ "สองมุมซ้าย" */
    .rounded-r     { border-radius: 0px 4px 4px 0px; } /* มนเฉพาะ "สองมุมขวา" (เหมือนแถวหัวข้อ cat-header เดิม) */


    .company-info {
    text-align: right;    /* จัดข้อความทั้งหมดไปชิดขวา */
    }

    /* สั่งให้แท็กทุกตัวข้างใน (h6, p, span) มีขนาด 14px และหนา 400 เท่ากันทั้งหมด */
    .company-info h6, 
    .company-info p, 
    .company-info span {
    font-size: 10px !important;
    font-weight: 200 !important;
    line-height: 1.2; /* เพิ่มระยะห่างบรรทัดเล็กน้อยเพื่อไม่ให้อักษรซ้อนกัน */
    display: block;   /* บังคับให้ span ขึ้นบรรทัดใหม่เหมือน p และ h6 */
    }

    @media print {
      .cat-block, .item-row { break-inside: avoid; page-break-inside: avoid; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <img src="data:image/webp;base64,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" alt="" width="462" height="104" />
      <div class="company-info">
        <h6>บริษัท ท็อป เซอร์วิส ออโต้ เทคนิค จำกัด (Top Service Auto Technic Co., Ltd.)</h6>
        <p>เลขที่ 236 ซอยลาดพร้าว 26 แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร โทร. 02-0444955</p>
        <span>เลขที่ผู้เสียภาษี 010 556 018 543 3</span>
      </div>
    </div>

  <!-- Title -->
  <div class="head-info">
  <div class="doc-title">รายละเอียดการตรวจเช็คสภาพ</div>

  <!-- Meta -->
  <div class="meta-grid">
    <div>
      <div class="meta-item">
        <span class="meta-label">ลูกค้า</span>
        <span class="meta-val">${data.customer_name}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">รุ่นรถ</span>
        <span class="meta-val">${data.car_model_name}</span>
      </div>
    </div>
    <div>
      <div class="meta-item">
        <span class="meta-label">โทร.</span>
        <span class="meta-val"></span>
      </div>
      <div class="meta-item">
        <span class="meta-label">ทะเบียน</span>
        <span class="meta-val">${data.plate}</span>
      </div>
    </div>
    <div>
      <div class="meta-item">
        <span class="meta-label">เลขโกโลเมตร</span>
        <span class="meta-val">${kmFormatted} km</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">เลขที่ใบงาน</span>
        <span class="meta-val">${data.quotation_no}</span>
      </div>
    </div>
    <div>
      <div class="meta-item">
        <span class="meta-label">วันที่ตรวจ</span>
        <span class="meta-val">${dateStr}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">ผู้ตรวจ</span>
        <span class="meta-val">${data.inspector_name}</span>
      </div>
    </div>
  </div>
  </div>


  <!-- Body -->
  <div class="body-wrap flex-row gap-4">

    <!-- Summary -->
    <div class="summary-box rounded-lg border border-gray-400 ">
    <div class="summary-head">
    <div class="sum-title">สรุปภาพรวม</div>
    <div>
    <span class="sum-total">${totalItems}</span>
    <span class="sum-unit"> รายการ</span>
    </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${okPct}%"></div>
      </div>
      <div class="sum-row flex flex-row jc-between ">
        <div class="flex flex-row gap-1 ai-center ">
       <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACshmLzAAADcklEQVRYCbVXTWgTQRR+M0lqbStEUOipTbEX8WA8ePHQbg7S9pZICyIFI4LXeFUPTQ7FawpePIgpSBEqNrfEXpK2Bw96iCCIEHFbsBQsNNC0laY747xtd51sJptNbQba3Xnzfr73N3lLwOPSluJB6DWiHNgocAhzQkLAedAUJ6RCONeBQIkBX/HtdWWLsUzFi2rSiknLxUOM1hJASNw22EpInBMCGWIEUsWJjO7G3hQAesx6ajNC+LGbgpZnlCdXby+kmvEpAaDXnNYKHCDUTLBNuk5ZIKKKBnUq0pbj4TM2jiYwjQVt+V7Yaa8uAh3w3GmvIRJ1EeiA504Ax5HAjjpZNoCRD9MzZ5hzS7/qGWJ9ZnGbZ2YKTlrtp4q7UzRRlENYlGYEuO8fov81OHxhEJ5cewRTg+Ouqhg5NNubaAXR74e1HVduj4f93Zfh1a1Z6PP3mBKvf7yHjPhrsip0PzBEoXYYbcLQFrnP3wtzN5/ZxlH4xsWrbjqChrjaKQcy6sbl9ezBlRj0n79Ux57bXKvbOzdU/K4ggIbLwcnYaj81MA6TjpwvbuQhv7naSjQsipCHWnG5nWPe48N36li2DrYhU16qo6k2nEOIip9W+1JQMbnRVHmvHu1D4vMsVI/23ESts6B9EVmUdp6qvGPlbx389qzGL4aIilsUsK+nBsagXN2A3K8127NmeX+3nvdsXDBW/GJ00EUdKAsR8yu31qQotudfXwoPt0+ddxmdGFp0v5hyvgiiEgBeKNalgoLYZggI8yzT28y7jKFEKaFFmSK/l6vrprcyDd9l47hvN+8og4sZfIVCwJc16+CY1vD/4censOiSV+z3NvNu2/D96crSYkRMr4zM21THC4b3xfc3kPg02xANr/3uUGlucWjFydlsQ8qP0iommVba+QZyNMq7G+30u6zqGIBhpPDFHslG8tNpIDzRwNkRAk+tji0kUbV9EdFz/qRAoyOxw0u3jKMdGwDWAmFGpMMgxFBqRGQHbQBILE681QnhsQ6B0KnQjTZkAMJW49Jyd8WHia9whkOq6bnTOFpWArAgjeSmk0D5jLU/1ZPzOXqwnyzGshWVvCsAFMBoMOpLitf7uPe0xNcyMDZPOUurvJZ1tARgMWtL0SB090QZJRoh5LqZHvnz3OwgXiJAV2BvV3yeqz229FnPv6zrYYOuvEDGAAAAAElFTkSuQmCC" alt="" width="16" height="16" />
        <span>ปกติ</span>
        </div>
        <span>${okCount} รายการ</span> 
      </div>
      <div class="sum-row flex flex-row jc-between ">
      <div class="flex flex-row gap-1 ai-center ">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACshmLzAAADsElEQVRYCbVWz0sUURz/zqwrlrQOCBWtwdOiQ0Vpl/IQtgfLo4IUQaDVoWN26Cju0iGoQ/YXpKegDLoEYYfFpLSTW6RFJD1olYSE0ZJc153t+x33DTNv5s2u4n5B377P98fn+77vfd8bDSqUGcaMP3noRvOOYhFaNQ0YFMGw3TUwEeOIZXA+sS8KL9s4NysJrZUzmmKM5fNwG+36HcJyTqTXYCQahVQ75zzMXJlAacVDSDoQFqCcDgmS5xd5SmUXmIC96g1IoxNTOW4T59FaSARVQ5cDvYuz1vzukhMFo5gUW+bzVKAKK5f5fJXwVKAKK5cTsCuRxo4SCieByUNsCEEmFFUcWSQPxGWLvQWl0v8QoDw2tJ+DhvazsDz+BtY+z8lqz7wmFoP9V3qhsLIKy6/HYXN11aMXEzyUzXQo7QTextkTbLd+oXSP9SeOw5nxVw707c5dWHo25szdP4j81NhTIB+Slalp+NR71W3i/C5q8LhjgQ/o9n4oyMm68VKn40Q/jj16CAcu93owmsjkhFHlVKIVoY+4ddyPbpUR4StTH3xqOYkgcnL6jVsQIgZxR67HDLpmff0pHHPZLOSyC9DYdVFA9khzwnM/s56yC6O12Tn4cvMWWLmcgIJGU5uMsxl6XIK0bozKTiuXZR0TqDvc5IGJnPZedQCFcREgo+M/JoCwkQ4eHUBZdkpOcbADmL6dF06VhEiq0pULexwN5yJygaE/qbfX8VwEydLzF2XLLvvpWAdTBlVzcdrrmrx7LuxbkoOBLSr0AaOp4z7wAIUPEuTikvEZlAC5RVV2hOP547pVhI9hRqRTkdOezw/d87lXmgQuPhO5ETMMjNDti1ICwsip1ei6DbsnKEml4HWsF/ADMuwcNHZ1One7CCSfdlV3tKQGhUvgSNx6Ar9ecS9GAy0QjMQaPCqZXCiDktjEFzFERog7QgZ99cZXPI0DQcb/vs/DnqNHYC/+me+nYfZav7LVKDnajvqTW68hv/8AVFtQsKBn9K9p4jnYkok4G8YXit6FqgtWPNWxyJNE5CRgP40bMIMAI0W1hFoPyZtFfOcmpP2wLEiQgVDu9kixicMd10mAwMQvzms06KlGEjY5xiYOdwJYcb+kDzKm65BGJfNrt4+IlcvkFMlTARGaDGmf0DElsJ2O9O1n1UJbEDnFDKyAm6xUjSQa9rnxsN9ISg/cqFWAYRWx8C+bgDCkLqFvOPx6uoBpn0acYdvSNQ4lQo7BMjidoBuODjXpysl/t7OQGk5SNqcAAAAASUVORK5CYII=" alt="" width="16" height="16" />
      <span>ต้องแก้ไข</span>
      </div>
        <span>${failCount} รายการ</span>
      </div>
      <div class="sum-legend">
        <div class="sum-title" style="margin-bottom:6px">สภาพโดยรวม</div>
        <div class="flex flex-row gap-2">
        <div class="legend-row"><span class="circle c-ok bg-transparent"></span> ดี</div>
        <div class="legend-row"><span class="circle c-warn bg-transparent"></span> พอใช้</div>
        <div class="legend-row"><span class="circle c-fail bg-transparent"></span> ต้องระวัง</div>
       </div>
      </div>
    </div>

    <!-- 2-column categories -->
    <div class="columns">
      <div>${renderCategories(col1)}</div>
      <div>${renderCategories(col2)}</div>
    </div>

  </div>

  <!-- Footer -->
<div style="display:grid; grid-template-columns:1fr auto; gap:32px; align-items:start; padding:12px; border-top:1px solid #ccc; font-size:13px; font-family:sans-serif; margin-top:8px;">

  <!-- หมายเหตุ -->
  <div style="display:flex; flex-direction:row; align-items:flex-start; gap:8px;">
    <span style="white-space:nowrap; line-height:24px;">หมายเหตุ</span>
    <div style="display:flex; flex-direction:column; gap:0; flex:1;">
      <div style="height:24px; border-bottom:1px dotted #333;"></div>
      <div style="height:24px; border-bottom:1px dotted #333;"></div>
    </div>
  </div>

  <!-- ผู้ตรวจเช็ค / วันที่ตรวจเช็ค -->
  <div style="display:flex; flex-direction:column; gap:0; min-width:300px;">
    <div style="display:flex; flex-direction:row; align-items:flex-end; gap:8px; height:24px;">
      <span style="white-space:nowrap;">ผู้ตรวจเช็ค</span>
      <div style="border-bottom:1px dotted #333; flex:1;"></div>
    </div>
    <div style="display:flex; flex-direction:row; align-items:flex-end; gap:8px; height:24px;">
      <span style="white-space:nowrap;">วันที่ตรวจเช็ค</span>
      <div style="border-bottom:1px dotted #333; flex:1;"></div>
    </div>
  </div>

</div>

</div>
</body>
</html>`;
}
